import { useEffect, useState } from 'react'; // Импортируем React и хуки для работы с состоянием и эффектами
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom"; // Импортируем компоненты роутера
import axios from 'axios'; // Импортируем axios для выполнения HTTP-запросов
import './App.css'; // Импортируем стили
import FileUpload from './FileUpload'; // Импортируем компонент для загрузки файлов
import FileList from "./FileList"; // Импортируем компонент для списка файлов
import MyFiles from "./MyFiles"; // Импортируем компонент для отображения "Моих файлов"
import FileDownload from "./FileDownload"; // Импортируем компонент для загрузки файла
import Auth from "./Auth"; // Импортируем компонент для авторизации
import AdminPanel from './AdminPanel'; // Импортируем компонент для админ-панели

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации пользователя
  const [savedToken, setSavedToken] = useState(''); // Состояние для хранения токена
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для открытия/закрытия мобильного меню

  // Обработчик входа
  const handleLogin = (token) => {
    localStorage.setItem('authToken', token); // Сохраняем токен в локальное хранилище
    setSavedToken(token); // Обновляем состояние токена
    setIsLoggedIn(true); // Устанавливаем состояние авторизации
  };

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Удаляем токен из локального хранилища
    setSavedToken(''); // Сбрасываем состояние токена
    setIsLoggedIn(false); // Устанавливаем состояние "не авторизован"
  };

  // Проверка токена при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Получаем токен из локального хранилища
    if (token) {
      setSavedToken(token); // Устанавливаем токен в состояние
      setIsLoggedIn(true); // Устанавливаем состояние авторизации
    }
    setLoading(false); // Завершаем состояние загрузки
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;  // Показать загрузку, пока не загрузилось состояние
  }

  // Обработчик открытия/закрытия меню
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Переключаем состояние меню
  };

  // Компонент для закрытия меню при смене маршрута
  const CloseMenuOnRouteChange = () => {
    const location = useLocation(); // Получаем текущий маршрут
    const [prevPath, setPrevPath] = useState(location.pathname); // Сохраняем предыдущий маршрут

    useEffect(() => {
      if (prevPath !== location.pathname) {
        setIsMenuOpen(false); // Закрываем меню, если маршрут изменился
      }
      setPrevPath(location.pathname); // Обновляем предыдущий маршрут
    }, [location]);

    return null; // Компонент ничего не рендерит
  };

  return (
    <>
      <Router>
        <CloseMenuOnRouteChange /> {/* Закрываем меню при смене маршрута */}
        <div>
          <nav>
            <ul className={`header-list header-modile ${isMenuOpen ? 'snow' : ''}`}> {/* Мобильное меню */}
              <li><Link to="/">Загрузить файл</Link></li>
              <li><Link to="/files">Список файлов</Link></li>
              <li><Link to="/my-files">Мои файлы</Link></li>
              {isLoggedIn && (
                <li><Link to="/admin-panel">Админ панель</Link></li>
              )}
            </ul>
            <ul className="header-list"> {/* Меню авторизации */}
              {isLoggedIn ? (
                  <li>
                    <button onClick={handleLogout}>Выйти</button> {/* Кнопка выхода */}
                  </li>
                ) : (
                  <li>
                    <Link to="/auth">Войти</Link> {/* Ссылка на авторизацию */}
                  </li>
                )}
            </ul>
            <a className="header-burger-modile" onClick={toggleMenu}> {/* Бургер-меню */}
              <svg viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
            </a>
          </nav>

          <Routes> {/* Настройка маршрутов */}
            <Route path="/" element={<FileUpload />} /> {/* Загрузка файлов */}
            <Route path="/files" element={<FileList />} /> {/* Список файлов */}
            <Route path="/my-files" element={<MyFiles />} /> {/* Мои файлы */}
            <Route path="/download/:url" element={<FileDownload />} /> {/* Загрузка файла */}
            <Route
              path="/auth"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace /> /* Перенаправление, если авторизован */
                ) : (
                  <Auth onLogin={handleLogin} /> /* Компонент авторизации */
                )
              }
            />
            <Route path="/admin-panel" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/auth" replace />} /> {/* Админ-панель */}
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App;
