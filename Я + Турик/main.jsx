import { StrictMode } from 'react'; // Импортируем StrictMode из React для включения дополнительных проверок
import { createRoot } from 'react-dom/client'; // Импортируем метод createRoot для создания корневого узла React
import './index.css'; // Импортируем глобальные стили
import App from './App.jsx'; // Импортируем главный компонент приложения

// Находим корневой элемент в HTML-документе
const rootElement = document.getElementById('root');

// Создаем корневой узел и рендерим приложение
createRoot(rootElement).render(
  <StrictMode> {/* Включаем StrictMode для выявления потенциальных проблем в приложении */}
    <App /> {/* Рендерим главный компонент приложения */}
  </StrictMode>,
);
