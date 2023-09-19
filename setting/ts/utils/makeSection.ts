import { IDM } from '@typings/db';
import dayjs from 'dayjs';


export default function makeSection(chatList: IDM[]) {
  const sections: { [key:string]: IDM[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  })
  return sections;
}

// sections= {
//   '2021-02-25' : [1, 4],
//   '2021-02-23' : [2],
//   '2021-02-24' : [3],
// }

// [{ id: 1, d: '2021-02-25' }, { id: 2, d: '2021-02-23' }, { id: 3, d: '2021-02-24' }, { id: 4, d: '2021-02-25' }]