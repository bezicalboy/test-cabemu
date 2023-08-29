function showToastMessage(message, type) {
    DevExpress.ui.notify(
      {
        message: message,
        maxWidth: "300px",
      },
      type,
      3000
    );
  }
  
  function redirectTo(navigasi) {
    window.location.href = navigasi;
  }
  
  export { showToastMessage, redirectTo };