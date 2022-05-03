import Message from 'molecules/chat/Message';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  const moveMeetingPage = () => {
    navigate('/meeting/0/0');
  };

  return (
    <div>
      <Message sender="Tooliv" contents="test" roomId="1" type="test" />
      <button onClick={moveMeetingPage} />
    </div>
  );
};

export default Main;
