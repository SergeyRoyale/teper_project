import React, { useState, useEffect } from "react"; // Импортируем React и хуки useState и useEffect
import axios from "axios"; // Импортируем axios для работы с HTTP-запросами
import { useParams } from "react-router-dom"; // Импортируем useParams для получения параметров маршрута
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Импортируем ReactTooltip для подсказок

const FileDownload = () => {
  const { url } = useParams(); // Получаем параметр "url" из маршрута
  const [file, setFile] = useState(null); // Состояние для хранения информации о файле
  const [loading, setLoading] = useState(true); // Состояние для отображения статуса загрузки

  // Объект с иконками для различных типов файлов
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

  // Функция для получения пути к иконке файла по его расширению
  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase(); // Извлекаем расширение файла
    return fileIcons[extension] || fileIcons.default; // Возвращаем соответствующую иконку или иконку по умолчанию
  };

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await axios.get(`https://lr.extremium.su/ext/get_file_info.php?url=${url}`); // Делаем запрос на сервер для получения информации о файле
        if (response.data && Object.keys(response.data).length > 0) {
          // Если файл удалён, не обновляем состояние
          if (response.data.status === 'deleted') {
            setFile(null); // Устанавливаем файл как отсутствующий
          } else {
            setFile(response.data); // Сохраняем данные о файле
          }
        } else {
          setFile(null); // Если данных нет, файл считается отсутствующим
        }
        setLoading(false); // Завершаем загрузку
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFile(null); // Если ошибка 404, файл не найден
        } else {
          console.error("Error fetching file info:", error); // Логируем другие ошибки
          setFile(null);
        }
        setLoading(false); // Завершаем загрузку даже в случае ошибки
      } finally {
        setLoading(false); // Завершаем загрузку в любом случае
      }
    };

    fetchFileInfo(); // Вызываем функцию получения информации о файле
  }, [url]); // Перезапускаем эффект при изменении URL

  // Функция для обработки загрузки файла
  const handleDownload = () => {
    const downloadUrl = `https://lr.extremium.su/ext/download.php?url=${url}`; // URL для скачивания файла

    // Создаем временный элемент <a> для скачивания
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.original_filename; // Устанавливаем имя скачиваемого файла
    document.body.appendChild(link);

    // Симулируем клик по ссылке для начала скачивания
    link.click();

    // Удаляем элемент <a> после скачивания
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Загрузка...</div>; // Показываем сообщение о загрузке, пока данные загружаются
  }

  if (!file) {
    return <div>Файл отсутствует.</div>; // Если файла нет, показываем соответствующее сообщение
  }

  return (
    <>
      <h2>Информация о файле</h2>
      <div className="download-main">
        <div className="download-block-main">
          <div className="download-block-info">
            {/* Отображаем иконку файла */}
            <img src={getFileIcon(file.original_filename)} className="file-list-img" />
            <div className="download-block-text">
              <div className="download-block-text-name">
                {file.original_filename}
                {/* Кнопка для копирования ссылки */}
                <svg onClick={() => handleCopyLink(file.url)} viewBox="0 0 640 512" data-tooltip-id="copyButtonTooltip" data-tooltip-content="Скопировать">
                  <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4 10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                </svg>
                <ReactTooltip id="copyButtonTooltip" />
              </div>
              <div>
                <strong>размер:</strong> {file.filesize} bytes
              </div>
            </div>
          </div>
          <div>
            <button onClick={handleDownload}>Скачать</button> {/* Кнопка для скачивания файла */}
          </div>
        </div>
        <div className="download-block-other-info">
          <div className="download-block-mini-info">
            <div><strong>Загружено:</strong> {file.upload_date}</div> {/* Дата загрузки файла */}
            <div><strong>Будет удалено:</strong> {file.delete_date}</div> {/* Дата удаления файла */}
          </div>
          <div>
            <div><strong>Загружено:</strong> {file.download_count}</div> {/* Количество загрузок */}
          </div>
        </div>
        <div className="download-block-desc-info">
          <strong>Описание:</strong> {file.description || "No description available"} {/* Описание файла или сообщение, если описания нет */}
        </div>
      </div>
    </>
  );
};

export default FileDownload;
