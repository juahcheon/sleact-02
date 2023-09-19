import React, { useCallback, useRef } from "react";
import { Container, Header } from "./styles";
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import gravatar from 'gravatar';
import useInput from "@hooks/useInput";
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import axios from "axios";
import { IDM } from "@typings/db";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
    (index) => `api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length -1]?.length < 20);
  const scrollbarRef = useRef<Scrollbars>(null);
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (chat?.trim()) {
      axios.post(`api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      })
      .then(() => {
        mutateChat;
        setChat('');
      })
      .catch(console.error);
    }
  }, [chat]);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? [...chatData].reverse() : [])

  return <Container>
    <Header>
      <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt="{userData.nickname}" />
      <span>{userData.nickname}</span>
    </Header>
    <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
    <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message ${userData.nickname}`}
        data={[]}
      />
  </Container>
};

export default DirectMessage;