import styled from '@emotion/styled';
import Button from 'atoms/common/Button';
import Icons from 'atoms/common/Icons';
import Text from 'atoms/text/Text';
import React, { useRef, useState } from 'react';
import { colors } from 'shared/color';
import { workspaceImgType } from 'types/workspace/workspaceTypes';
import { ReactComponent as ImageIcon } from '../../assets/img/image.svg';

const Container = styled.div`
  width: 280px;
  /* width: 100%; */
  height: 240px;
  margin: 30px auto;
  border: 5px dashed ${colors['gray200']};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
`;

const UploadInput = styled.input`
  display: none;
`;

const Preview = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;
const UploadWrapper = styled.div`
  height: 100%;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const FileUploader = ({ onChange }: workspaceImgType) => {
  const [imgFile, setImgFile] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadBtnClick = () => {
    inputRef.current?.click();
  };

  const handleUploadImage = async (event: any) => {
    // setIsLoading(true);
    const file = event.target.files;
    onChange(URL.createObjectURL(file[0]));
    setImgFile(URL.createObjectURL(file[0]));
    const formData = new FormData();
    formData.append('file', file[0]);
  };

  return (
    <Container onClick={handleUploadBtnClick}>
      <UploadInput
        type="file"
        id="inputImage"
        onChange={handleUploadImage}
        ref={inputRef}
        accept="image/*"
      />
      {imgFile ? (
        <Preview src={imgFile}>
          {/* <img src={imgFile} alt="preview" /> */}
        </Preview>
      ) : (
        <UploadWrapper>
          {/* <Icons icon="image" width="42" height="42" color="blue100" /> */}
          <ImageIcon width={42} height={42} />
          <Text color="gray300" size={14}>
            5MB이내 PNG, JPG, GIF 파일
          </Text>
          <Button text="이미지 선택하기" onClick={handleUploadBtnClick} />
        </UploadWrapper>
      )}
    </Container>
  );
};

export default FileUploader;