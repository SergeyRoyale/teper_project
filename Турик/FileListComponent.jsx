import React, { useState, useEffect } from "react"; // Импортируем React и хуки для работы с состоянием и эффектами
import axios from "axios"; // Импортируем axios для выполнения HTTP-запросов
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate для навигации
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Импортируем ReactTooltip для подсказок

const FileListComponent = ({ apiUrl, pageTitle }) => {
  const [files, setFiles] = useState([]); // Состояние для списка файлов
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(0); // Общее количество страниц
  const filesPerPage = 7; // Количество файлов на страницу

  // Сопоставление расширений файлов с иконками
  const fileIcons = {
    txt: "/src/assets/txt-icon.png",
    pdf: "/src/assets/pdf-icon.png",
    jpg: "/src/assets/jpg-icon.png",
    jpeg: "/src/assets/jpg-icon.png",
    png: "/src/assets/png-icon.png",
    doc: "/src/assets/doc-icon.png",
    docx: "/src/assets/docx-icon.png",
    mp4: "/src/assets/mp4-icon.png",
    rar: "/src/assets/rar-icon.png",
    zip: "/src/assets/zip-icon.png",
    default: "/src/assets/default-icon.png", // Иконка по умолчанию
  };

  // Функция для определения иконки по имени файла
  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase(); // Получаем расширение файла
    return fileIcons[extension] || fileIcons.default; // Возвращаем подходящую иконку или иконку по умолчанию
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Запрос к API для получения файлов с учетом пагинации
        const response = await axios.get(`${apiUrl}?page=${currentPage}&limit=${filesPerPage}`);
        setFiles(response.data.files); // Устанавливаем список файлов
        setTotalPages(response.data.pagination.pages); // Устанавливаем общее количество страниц
      } catch (error) {
        console.error("Error fetching files:", error); // Логируем ошибки
      }
    };

    fetchFiles(); // Вызываем функцию для загрузки файлов
  }, [apiUrl, currentPage]); // Выполняем эффект при изменении apiUrl или текущей страницы

  // Функция для смены страницы
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Устанавливаем новую текущую страницу
  };

  // Функция для копирования ссылки на файл в буфер обмена
  const handleCopyLink = (url) => {
    const downloadLink = `https://lr.extremium.su/download/${url}`; // Формируем ссылку для скачивания
    navigator.clipboard.writeText(downloadLink).then(
      () => {
        alert("Ссылка скопирована в буфер обмена!"); // Показываем сообщение об успешном копировании
      },
      (err) => {
        console.error("Ошибка копирования ссылки:", err); // Логируем ошибку копирования
      }
    );
  };

  const navigate = useNavigate(); // Хук для навигации

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Преобразуем строку в объект Date
    const day = String(date.getDate()).padStart(2, '0'); // Получаем день с ведущим нулем
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Получаем месяц с ведущим нулем
    const year = date.getFullYear(); // Получаем год
    return `${day}.${month}.${year}`; // Возвращаем форматированную дату
  };

  return (
    <div>
      <h2 className="file-list-h2">{pageTitle}</h2> {/* Заголовок страницы */}
      <div className="file-list-main">
        {files.length === 0 ? (
          <div>Файлы не найдены.</div> // Сообщение, если файлов нет
        ) : (
        files.map((file) => (
          <div className="file-list-box" key={file.id}> {/* Карточка файла */}
            <div className="file-list-icon">
              <img src={getFileIcon(file.original_filename)} className="file-list-img" /> {/* Иконка файла */}
              <div className="file-list-info">
                <strong>
                  {file.original_filename}
                  {/* Кнопка для копирования ссылки */}
                  <svg onClick={() => handleCopyLink(file.url)} viewBox="0 0 640 512" data-tooltip-id="copyButtonTooltip" data-tooltip-content="Скопировать">
                    <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                  </svg>
                  <ReactTooltip id="copyButtonTooltip" />
                </strong>
                <div className="file-list-mini-info">Дата загрузки: <i>{formatDate(file.upload_date)}</i> Размер файла: <i>{file.filesize} bytes</i></div> {/* Информация о дате и размере файла */}
              </div>
            </div>
            <button onClick={() => navigate(`/download/${file.url}`)}>Скачать файл</button> {/* Кнопка для скачивания файла */}
          </div>
        )))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))} {/* Кнопки пагинации */}
      </div>
    </div>
  );
};

export default FileListComponent;
