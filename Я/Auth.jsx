import React, { useState, useEffect } from 'react'; // Импортируем React и хуки для работы с состоянием и эффектами
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для перенаправления
import axios from 'axios'; // Импортируем axios для выполнения HTTP-запросов

const Auth = ({ onLogin }) => {
  const [login, setLogin] = useState(''); // Состояние для логина пользователя
  const [password, setPassword] = useState(''); // Состояние для пароля пользователя
  const [response, setResponse] = useState(null); // Состояние для успешного ответа от сервера
  const [error, setError] = useState(null); // Состояние для ошибки авторизации

  const navigate = useNavigate(); // Хук для навигации между страницами

  // Проверяем, авторизован ли пользователь
  // Перенаправляем на главную страницу, если пользователь уже авторизован
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
    if (token) {
      navigate('/'); // Если токен существует, перенаправляем на главную страницу
    }
  }, [navigate]);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    setError(null); // Сбрасываем предыдущее состояние ошибки

    try {
      // Выполняем GET-запрос для авторизации
      const res = await axios.get(`https://lr.extremium.su/ext/auth.php`, {
        params: { login, password }, // Передаем логин и пароль как параметры запроса
      });

      if (res.data.success) {
        // Если авторизация успешна
        const token = res.data.token; // Получаем токен из ответа сервера
        setResponse(`Token: ${res.data.token}`); // Отображаем токен для пользователя (опционально)
        localStorage.setItem('authToken', res.data.token); // Сохраняем токен в localStorage
        onLogin(token); // Вызываем колбэк onLogin с токеном
        navigate('/'); // Перенаправляем на главную страницу
      } else {
        setError(res.data.error || 'Authentication failed'); // Если авторизация не удалась, сохраняем сообщение об ошибке
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Network error'); // Обрабатываем ошибки запроса
    }
  };

  return (
    <div className="auth-main"> {/* Основной контейнер страницы авторизации */}
      <img className="auth-logo" src="/src/assets/react.svg" /> {/* Логотип */}
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}> {/* Форма авторизации */}
        <input
          type="text"
          placeholder="Логин" // Поле для ввода логина
          value={login} // Значение поля логина
          onChange={(e) => setLogin(e.target.value)} // Обновляем состояние логина при изменении значения
        />
        <input
          type="password"
          placeholder="Пароль" // Поле для ввода пароля
          value={password} // Значение поля пароля
          onChange={(e) => setPassword(e.target.value)} // Обновляем состояние пароля при изменении значения
        />
        <button type="submit">Войти</button> {/* Кнопка отправки формы */}
      </form>
      {response && <p>{response}</p>} {/* Отображаем успешный ответ от сервера, если есть */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображаем ошибку, если есть */}
    </div>
  );
};

export default Auth;
