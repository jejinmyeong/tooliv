import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Stomp from 'stompjs';
import Editor from '../molecules/chat/Editor';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  channelContents,
  channelMessage,
  channelNotiList,
  chatFileNames,
  chatFiles,
  chatFileUrl,
} from '../recoil/atom';
import { channelNotiType, contentTypes } from '../types/channel/contentType';
import Messages from '../organisms/chat/Messages';
import { enterChannel, subChannel } from 'api/chatApi';
import Files from 'organisms/chat/Files';
import { FileTypes } from 'types/common/fileTypes';
import { user } from 'recoil/auth';
import LoadSpinner from 'atoms/common/LoadSpinner';
import { send } from 'services/wsconnect';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 70px;
`;

const LoadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Channel = () => {
  const [message, setMessage] = useRecoilState<string>(channelMessage);
  const [files, setFiles] = useRecoilState<FileTypes[]>(chatFiles);
  const [contents, setContents] =
    useRecoilState<contentTypes[]>(channelContents);
  const [fileUrl, setFileUrl] = useRecoilState<string[]>(chatFileUrl);
  const [fileNames, setFileNames] = useRecoilState<string[]>(chatFileNames);
  const { accessToken, nickname, email } = useRecoilValue(user);
  const [notiList, setNotiList] =
    useRecoilState<channelNotiType[]>(channelNotiList);
  const { channelId } = useParams<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const newList: channelNotiType[] = notiList.map((noti) => {
      if (noti.channelId === channelId)
        return { ...noti, notificationRead: true };
      else return noti;
    });
    console.log(newList);
    setNotiList(newList);
    setIsLoading(true);
    enterChannel(channelId!).then(() => {
      subChannel(channelId!).then((res) => {
        setContents(res.data.chatMessageDTOList);
        setIsLoading(false);
      });
    });
  }, [channelId]);

  const onSendClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    send({
      accessToken,
      channelId,
      nickname,
      email,
      message,
      fileUrl,
      fileNames,
    });
  };

  const sendMessage = () => {
    send({
      accessToken,
      channelId,
      nickname,
      email,
      message,
      fileUrl,
      fileNames,
    });

    setMessage('');
    setFiles([]);
    setFileUrl([]);
  };

  return (
    <>
      <Container>
        {isLoading ? (
          <LoadContainer>
            <LoadSpinner />
          </LoadContainer>
        ) : (
          <Messages />
        )}
        <Files />
        <Editor onClick={onSendClick} sendMessage={sendMessage} />
      </Container>
    </>
  );
};

export default Channel;
