import React, { useState } from 'react'; // Импортируем React и хук useState для работы с состоянием
import axios from 'axios'; // Импортируем axios для отправки HTTP-запросов

const FileUpload = () => {
  const [file, setFile] = useState(null); // Состояние для выбранного файла
  const [isFeedActive, setIsFeedActive] = useState(false); // Состояние для флажка "Публичный файл"
  const [description, setDescription] = useState(''); // Состояние для описания файла
  const [fileLifetime, setFileLifetime] = useState("1"); // Состояние для срока жизни файла (по умолчанию 1 день)
  const [message, setMessage] = useState(''); // Состояние для сообщений пользователю
  const [uploadedFileData, setUploadedFileData] = useState(null); // Состояние для данных загруженного файла

  // Функция для обработки выбора файла
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Устанавливаем выбранный файл в состояние
    document.getElementById("uploadBtn").innerHTML = e.target.files[0].name; // Обновляем текст кнопки выбора файла
  };

  // Функция для обработки изменения состояния флажка
  const handleCheckboxChange = (e) => {
    setIsFeedActive(e.target.checked); // Устанавливаем состояние флажка
  };

  // Функция для обработки изменения описания файла
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value); // Устанавливаем новое описание
  };

  // Функция для обработки изменения срока жизни файла
  const handleFileLifetimeChange = (e) => {
    setFileLifetime(e.target.value); // Устанавливаем новый срок жизни файла
  };

  // Функция для загрузки файла
  const handleUpload = async () => {
    if (!file) { // Проверяем, выбран ли файл
      setMessage('Пожалуйста, выберите файл.');
      return;
    }

    const formData = new FormData(); // Создаем объект FormData для отправки данных на сервер
    formData.append('file', file); // Добавляем файл в FormData
    formData.append('is_feed_active', isFeedActive ? 1 : 0); // Добавляем статус публичности файла
    formData.append('description', description); // Добавляем описание файла
    formData.append("file_lifetime", fileLifetime); // Добавляем срок жизни файла

    try {
        const response = await axios.post('https://lr.extremium.su/ext/upload.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Указываем тип содержимого
          },
        });
        setMessage(response.data.message); // Отображаем сообщение от сервера

        // Если файл успешно загружен, сохраняем информацию о нем
        if (response.data.file) {
          setUploadedFileData(response.data.file);
        }
      } catch (error) {
        if (error.response) { // Обрабатываем ошибки сервера
          setMessage('Ошибка сервера: ' + error.response.data.message);
        } else { // Обрабатываем ошибки запроса
          setMessage('Ошибка запроса: ' + error.message);
        }
      }
  };

  // Функция для открытия окна выбора файла
  const triggerFileInput = () => {
    document.getElementById("fileInput").click(); // Имитация клика по скрытому input
  };

  return (
    <div>
      <h1>Система обмена файлами</h1>
      {uploadedFileData ? ( // Если файл загружен, показываем информацию о нем
        <div className="uploaded-file-info">
          <h2>Информация о загруженном файле:</h2>
          <p><strong>Название файла:</strong> {uploadedFileData.original_filename}</p>
          <p><strong>Срок жизни:</strong> до {uploadedFileData.delete_date ? uploadedFileData.delete_date : 'Без срока (постоянный)'}</p>
          <p><strong>Описание:</strong> {uploadedFileData.description || 'Отсутствует'}</p>
          <p><strong>Ссылка для скачивания:</strong> <a href={`/download/${uploadedFileData.url}`} target="_blank" rel="noopener noreferrer">Скачать файл</a></p>
        </div>
      ) : (
      <div className="upload-file-main">
        <div id="uploadBtn" className="upload-btn" onClick={triggerFileInput}>Нажмите для выбора файла</div>
        <input id="fileInput" type="file" style={{ display: "none" }} onChange={handleFileChange} /> {/* Скрытый input для выбора файла */}
        <div className="upload-lifetime">
          <label>Выберите срок жизни файла:</label>
          <select value={fileLifetime} onChange={handleFileLifetimeChange}> {/* Выпадающий список для выбора срока жизни файла */}
            <option value="1">1 день</option>
            <option value="3">3 дня</option>
            <option value="7">7 дней</option>
            <option value="30">30 дней</option>
            <option value="0">Без срока (постоянный)</option>
          </select>
        </div>
        <label className="upload-for-public">
          <input type="checkbox" checked={isFeedActive} onChange={handleCheckboxChange} /> {/* Флажок для публичного файла */}
          Публичный файл
        </label>
        <textarea placeholder="Добавьте описание файла, если необходимо" value={description} onChange={handleDescriptionChange} rows="4" cols="42" /> {/* Поле для ввода описания */}
        <button onClick={handleUpload}>Загрузить</button> {/* Кнопка для загрузки файла */}
      </div>
      )}
      <p>{message}</p> {/* Сообщение пользователю */}
    </div>
  );
};

export default FileUpload;
