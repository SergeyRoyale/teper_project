import React from "react"; // Импортируем React для создания компонента
import FileListComponent from "./FileListComponent"; // Импортируем компонент для отображения списка файлов

const FileList = () => {
  // URL API для получения списка файлов
  const apiUrl = "https://lr.extremium.su/ext/get_files.php";

  // Заголовок страницы
  const pageTitle = "Загруженные файлы";

  return (
    // Рендерим компонент FileListComponent с переданными props
    <FileListComponent apiUrl={apiUrl} pageTitle={pageTitle} />
  );
};

export default FileList; // Экспортируем компонент для использования в других частях приложения
