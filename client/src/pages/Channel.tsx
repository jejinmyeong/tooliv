import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '../molecules/chat/Editor';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  channelContents,
  channelMessage,
  channelNotiList,
  chatFileNames,
  chatFiles,
  chatFileUrl,
  chatMember,
  searchIndex,
  searchResults,
  wsList,
} from '../recoil/atom';
import { channelNotiType, contentTypes } from '../types/channel/contentType';
import Messages from '../organisms/chat/Messages';
import { enterChannel, subChannel, updateLoggedTime } from 'api/chatApi';
import Files from 'organisms/chat/Files';
import { FileTypes } from 'types/common/fileTypes';
import { user } from 'recoil/auth';
import LoadSpinner from 'atoms/common/LoadSpinner';
import { send } from 'services/wsconnect';
import { workspaceListType } from 'types/workspace/workspaceTypes';
import { ReactComponent as Empty } from 'assets/img/empty.svg';

const Container = styled.div<{ isFiles: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Info = styled.div`
  padding: 10px;
`;
const Channel = () => {
  const [message, setMessage] = useRecoilState<string>(channelMessage);
  const [files, setFiles] = useRecoilState<FileTypes[]>(chatFiles);
  const [fileUrl, setFileUrl] = useRecoilState<string[]>(chatFileUrl);
  const [fileNames, setFileNames] = useRecoilState<string[]>(chatFileNames);
  const [contents, setContents] =
    useRecoilState<contentTypes[]>(channelContents);
  const [chatMembers, setChatMembers] = useRecoilState<string[]>(chatMember);
  const { email } = useRecoilValue(user);
  const [notiList, setNotiList] =
    useRecoilState<channelNotiType[]>(channelNotiList);
  const { workspaceId, channelId } = useParams<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workspaceList, setWorkspaceList] =
    useRecoilState<workspaceListType[]>(wsList);
  const [searchList, setSearchList] = useRecoilState<number[]>(searchResults);
  const [searchedIndex, setSearchedIndex] = useRecoilState<number>(searchIndex);

  useEffect(() => {
    setSearchList([]);
    setSearchedIndex(-1);

    let flag = false;
    const newList: channelNotiType[] = notiList.map((noti) => {
      if (
        noti.workspaceId === workspaceId &&
        noti.channelId !== channelId &&
        noti.notificationRead
      ) {
        flag = true;
      }
      if (noti.channelId === channelId) {
        return { ...noti, notificationRead: false };
      } else return noti;
    });

    if (!flag) {
      setWorkspaceList(
        workspaceList.map((dto: any) => {
          if (workspaceId === dto.id) {
            return { ...dto, noti: false };
          } else return dto;
        })
      );
    }
    setNotiList(newList);
    setIsLoading(true);
    enterChannel(channelId!).then(() => {
      subChannel(channelId!).then((res) => {
        setContents(res.data.chatMessageDTOList);
        setIsLoading(false);

        let list: string[] = [];
        res.data.chatMessageDTOList?.forEach((data: contentTypes) => {
          list.push(data.email);
        });
        let result = Array.from(new Set(list));
        setChatMembers(result);
      });
    });

    return () => {
      setFiles([]);
      setFileUrl([]);
    };
  }, [channelId]);

  useEffect(() => {
    window.addEventListener('beforeunload', (e: any) => {
      updateLoggedTime(channelId, 'CHANNEL');
    });
  }, [workspaceId, channelId]);

  const onSendClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (message !== '') sendMessage();
    else if (files.length > 0) sendMessage();
  };

  const sendMessage = () => {
    send({
      channelId,
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
    <Container isFiles={files.length > 0}>
      {isLoading ? (
        <LoadContainer>
          <LoadSpinner />
        </LoadContainer>
      ) : contents.length > 0 ? (
        <Messages />
      ) : (
        <InfoContainer>
          <Empty />
          <Info>아직 채널에 메시지가 존재하지 않습니다.</Info>
          <Info>채널에 첫 메시지를 보내 보세요!</Info>
        </InfoContainer>
      )}
      {files.length > 0 && <Files />}
      <Editor isButton={true} onClick={onSendClick} sendMessage={sendMessage} />
    </Container>
  );
};

export default Channel;
