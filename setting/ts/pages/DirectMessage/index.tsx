import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import useSWR from 'swr';
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import gravatar from 'gravatar';
import useInput from "@hooks/useInput";
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit');
  }, []);

  if (!userData || !myData) {
    return null;
  }

  return <Container>
    <Header>
      <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt="{userData.nickname}" />
      <span>{userData.nickname}</span>
    </Header>
    <ChatList />
    <ChatBox chat="" />
  </Container>
};

export default DirectMessage;