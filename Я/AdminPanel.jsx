import React, { useState, useEffect } from "react"; // Импортируем React и хуки useState и useEffect для работы с состоянием и эффектами
import axios from "axios"; // Импортируем axios для выполнения HTTP-запросов
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Импортируем ReactTooltip для подсказок

const AdminPanel = () => {
  const [files, setFiles] = useState([]); // Список файлов
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [totalPages, setTotalPages] = useState(0); // Общее количество страниц
  const [totalFiles, setTotalFiles] = useState(0); // Общее количество файлов

  const [selectedFile, setSelectedFile] = useState(null); // Выбранный файл для отображения информации
  const [modalVisible, setModalVisible] = useState(false); // Состояние отображения модального окна
  const [modalAnimation, setModalAnimation] = useState(""); // Анимация модального окна
  const [modalType, setModalType] = useState(""); // Тип модального окна

  const [isLoading, setIsLoading] = useState(true); // Флаг загрузки данных

  const [fileIPs, setFileIPs] = useState([]); // История скачиваний файлов (IP-адреса)
  const [deleteFileId, setDeleteFileId] = useState(null); // ID файла для удаления
  const [isFileDeleted, setIsFileDeleted] = useState(null); // Состояние удалённого файла

  const filesPerPage = 10; // Количество файлов на одной странице

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true); // Устанавливаем состояние загрузки
      try {
        // Запрашиваем список файлов для админа с пагинацией
        const response = await axios.get(`https://lr.extremium.su/ext/get_files_admin.php?page=${currentPage}&limit=${filesPerPage}`);
        setFiles(response.data.files); // Устанавливаем полученные файлы
        setTotalPages(response.data.pagination.pages); // Устанавливаем общее количество страниц
        setTotalFiles(response.data.pagination.total); // Устанавливаем общее количество файлов
      } catch (error) {
        console.error("Error fetching files:", error); // Логируем ошибки
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    fetchFiles(); // Вызываем функцию загрузки файлов
  }, [currentPage]); // Перезапуск при изменении текущей страницы

  // Функция для смены страницы
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Обновляем текущую страницу
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Преобразуем строку в объект Date
    const day = String(date.getDate()).padStart(2, '0'); // Получаем день с ведущим нулем
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Получаем месяц с ведущим нулем
    const year = date.getFullYear(); // Получаем год
    const hours = String(date.getHours()).padStart(2, '0'); // Часы с ведущим нулем
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Минуты с ведущим нулем
  
    return `${day}.${month}.${year} в ${hours}:${minutes}`; // Возвращаем форматированную дату
  };

  // Функция для получения подробной информации о файле
  const fetchFileInfo = async (fileUrl) => {
    try {
      const response = await axios.get(`https://lr.extremium.su/ext/get_file_info.php?url=${encodeURIComponent(fileUrl)}`);
      setSelectedFile(response.data); // Устанавливаем данные файла
      setModalType("fileInfo"); // Устанавливаем тип модального окна
      setModalAnimation("show"); // Анимация открытия
      setModalVisible(true); // Отображаем модальное окно
    } catch (error) {
      console.error("Error fetching file info:", error); // Логируем ошибки
    }
  };

  // Функция для получения истории скачиваний файла
  const fetchFileIPs = async (fileId) => {
    try {
      const response = await axios.get(`https://lr.extremium.su/ext/get_file_download_ips.php?file_id=${fileId}`);
      if (Array.isArray(response.data.downloads) && response.data.downloads.length > 0) {
        // Мапируем данные скачиваний
        setFileIPs(response.data.downloads.map((download) => ({
          ip: download.ip,
          date: download.date,
        })));
      } else {
        setFileIPs([]); // Если данных нет, устанавливаем пустой массив
      }
      setModalType("fileIPs");
      setModalAnimation("show");
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching file IPs:", error);
    }
  };

  // Функция для проверки статуса файла
  const checkFileStatus = async (fileId) => {
    try {
      const response = await axios.get(`https://lr.extremium.su/ext/get_file_status.php?id=${fileId}`);
      const data = response.data;
      if (data.status === "deleted") {
        setIsFileDeleted(true); // Файл удалён
      } else {
        setIsFileDeleted(false); // Файл активен
      }
    } catch (error) {
      console.error("Ошибка при загрузке статуса файла:", error);
      setIsFileDeleted(false);
    }
  };

  // Функция для удаления файла
  const deleteFile = async () => {
    try {
      const response = await axios.get(`https://lr.extremium.su/ext/delete_file.php?id=${deleteFileId}`);
      if (response.data.success) {
        alert("Файл успешно удалён."); // Уведомляем об успешном удалении
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== deleteFileId)); // Удаляем файл из списка
      } else {
        alert("Ошибка при удалении файла.");
      }
    } catch (error) {
      console.error("Ошибка при удалении файла:", error); // Логируем ошибки
    } finally {
      closeModal(); // Закрываем модальное окно
    }
  };
  

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalAnimation("hide"); // Анимация закрытия
    setTimeout(() => {
      setModalVisible(false);
      setSelectedFile(null);
      setModalType("");
      setIsFileDeleted(null);
    }, 500); // Ожидание завершения анимации
  };

  // Функция для подтверждения удаления файла
  const handleDeleteConfirm = (fileId) => {
    setDeleteFileId(fileId); // Устанавливаем ID файла для удаления
    checkFileStatus(fileId); // Проверяем статус файла
    setModalType("confirmDelete"); // Тип модального окна для удаления
    setModalAnimation("show"); // Анимация открытия
    setModalVisible(true); // Показываем модальное окно
  };
      
  return (
    <div>
      <h2>Админ панель</h2>
      {isLoading ? (
      <p>Загрузка данных...</p> // Сообщение при загрузке
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Оригинальное имя</th>
              <th className="text-center">Размер</th>
              <th className="text-center">Дата загрузки</th>
              <th className="text-center">Скачиваний</th>
              <th className="text-center">IP пользователя</th>
              <th className="text-center">Статус</th>
              <th>Взаимодействие</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={file.id}>
                <td>{totalFiles - ((currentPage - 1) * filesPerPage + index)}</td> {/* Номер файла */}
                <td>{file.original_filename}</td> {/* Оригинальное имя файла */}
                <td className="text-center">{file.filesize}</td> {/* Размер файла */}
                <td className="text-center">{formatDate(file.upload_date)}</td> {/* Дата загрузки */}
                <td className="text-center">{file.download_count}</td> {/* Количество скачиваний */}
                <td className="text-center">{file.user_ip}</td> {/* IP пользователя */}
                <td className="text-center">
                  {file.status === "active" ? (
                    <div className="admin-panel-table-svg-icon" data-tooltip-id="iconStatusTrueTooltip" data-tooltip-content="Активен"><svg className="admin-panel-green-circle" viewBox="0 0 512 512" width="20" height="20"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" /></svg><ReactTooltip id="iconStatusTrueTooltip" /></div>
                  ) : (
                    <div className="admin-panel-table-svg-icon" data-tooltip-id="iconStatusFalseTooltip" data-tooltip-content="Удален"><svg className="admin-panel-red-circle" viewBox="0 0 512 512" width="20" height="20"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" /></svg><ReactTooltip id="iconStatusFalseTooltip" /></div>
                  )}
                </td>
                <td className="text-center">
                  <div className="admin-panel-buttons-table">
                    <a className="admin-panel-button" onClick={() => fetchFileInfo(file.url)} data-tooltip-id="moreInfoButtonTooltip" data-tooltip-content="Подробная информация">
                      <svg viewBox="0 0 384 512"><path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 144zM80 352c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 336c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 240z"/></svg>
                    </a>
                    <ReactTooltip id="moreInfoButtonTooltip" />
                    <a className="admin-panel-button" onClick={() => fetchFileIPs(file.id)} data-tooltip-id="historyButtonTooltip" data-tooltip-content="История скачиваний">
                      <svg viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                    </a>
                    <ReactTooltip id="historyButtonTooltip" />
                    <a className="admin-panel-button" onClick={() => handleDeleteConfirm(file.id)} data-tooltip-id="deleteButtonTooltip" data-tooltip-content="Удалить">
                      <svg viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>
                    </a>
                    <ReactTooltip id="deleteButtonTooltip" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))} {/* Пагинация */}
      </div>

      {modalVisible && ( // Условие для отображения модального окна, если modalVisible === true
        <>
          <div className={`modal-backdrop ${modalAnimation === "show" ? "show" : ""}`} /> {/* Фон модального окна с анимацией */}
          <div className={`modal ${modalAnimation}`}> {/* Само модальное окно с анимацией */}
            <div className="modal-content"> {/* Контент модального окна */}
              {modalType === "fileInfo" && selectedFile && ( // Условие для отображения информации о файле
                <>
                  <h3>Информация о файле</h3>
                  <p><strong>Оригинальное название:</strong> {selectedFile.original_filename}</p> {/* Имя файла */}
                  <p><strong>Новое название в папке:</strong> {selectedFile.new_filename}</p> {/* Имя файла на сервере */}
                  <p><strong>Размер:</strong> {selectedFile.filesize}</p> {/* Размер файла */}
                  <p><strong>Описание:</strong> {selectedFile.description}</p> {/* Описание файла */}
                  <p><strong>Количество скачиваний:</strong> {selectedFile.download_count}</p> {/* Количество скачиваний */}
                  <p><strong>Загружен:</strong> {formatDate(selectedFile.upload_date)}</p> {/* Дата загрузки */}
                  <p><strong>Будет удален:</strong> {formatDate(selectedFile.delete_date)}</p> {/* Дата удаления */}
                  <p><strong>Состояние файла:</strong> {selectedFile.status === "active" ? ( 'Есть в системе' ) : ( 'Удален' )}</p> {/* Статус файла */}
                  <p><strong>Ссылка на скачивание:</strong> <a href={`/download/${selectedFile.url}`} target="_blank" rel="noopener noreferrer">Скачать файл</a></p> {/* Ссылка на файл */}
                  <button onClick={closeModal}>Закрыть</button> {/* Кнопка для закрытия модального окна */}
                </>
              )}

              {modalType === "fileIPs" && ( // Условие для отображения истории скачиваний
                <div>
                  <h3>Скачивания</h3>
                  {fileIPs.length > 0 ? ( // Если есть данные о скачиваниях
                    <>
                      <table>
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">IP пользователя</th>
                            <th className="text-center">Дата и время</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fileIPs.map((file, index) => ( // Перебираем данные о скачиваниях
                            <tr key={`${file.id}-${index}`}>
                              <td className="text-center">{index + 1}</td> {/* Номер записи */}
                              <td className="text-center">{file.ip}</td> {/* IP пользователя */}
                              <td className="text-center">{formatDate(file.date)}</td> {/* Дата скачивания */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button onClick={closeModal}>Закрыть</button> {/* Кнопка для закрытия окна */}
                    </>
                  ) : (
                    <>
                      <p>Никто не скачивал этот ресурс.</p> {/* Сообщение, если нет данных о скачиваниях */}
                      <button onClick={closeModal}>Закрыть</button> {/* Кнопка для закрытия окна */}
                    </>
                  )}
                </div>
              )}

              {modalType === "confirmDelete" && ( // Условие для подтверждения удаления
                <>
                  {isFileDeleted === null ? ( // Если статус файла загружается
                    <p>Загрузка...</p>
                  ) : isFileDeleted ? ( // Если файл уже удалён
                    <>
                      <p>Файл уже удалён.</p>
                      <button onClick={closeModal}>Закрыть</button> {/* Кнопка для закрытия окна */}
                    </>
                  ) : ( // Если файл ещё доступен
                    <div>
                      <h3>Вы действительно хотите удалить этот ресурс?</h3>
                      <div className="modal-actions">
                        <button onClick={deleteFile}>Удалить</button> {/* Кнопка для удаления файла */}
                        <button onClick={closeModal}>Закрыть</button> {/* Кнопка для закрытия окна */}
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </>
      )}
