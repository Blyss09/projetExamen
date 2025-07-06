import Header from '../../components/header/Header';
import GameCards from '../../components/gameCard/gameCards';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <GameCards />
    </>
  );
}

export default Games;
