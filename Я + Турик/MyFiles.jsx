import React from "react"; // Импортируем React для создания функционального компонента
import FileListComponent from "./FileListComponent"; // Импортируем компонент для отображения списка файлов

const MyFiles = () => {
  // URL API для получения списка "моих файлов"
  const apiUrl = "https://lr.extremium.su/ext/get_my_files.php";

  // Заголовок страницы для отображения пользователю
  const pageTitle = "Мои файлы";

  return (
    // Рендерим компонент FileListComponent с переданными props
    <FileListComponent apiUrl={apiUrl} pageTitle={pageTitle} />
  );
};

export default MyFiles; // Экспортируем компонент для использования в других частях приложения
