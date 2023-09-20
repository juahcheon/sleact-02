import React, { useCallback, forwardRef } from "react";
import { ChatZone, Section, StickyHeader } from "./styles";
import { IChat, IDM } from "@typings/db";
import Chat from "@components/Chat";
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections?: {[key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  const onscroll = useCallback((values) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
        setSize((prevSize) => prevSize + 1).then(() => {

        });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onscroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          )
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;