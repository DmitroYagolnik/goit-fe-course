export const set = value => {
    localStorage.setItem('save-user-URL', JSON.stringify(value));
  };
  
  export const get = () => {
    const data = localStorage.getItem('save-user-URL');
  
    return data ? JSON.parse(data) : null;
  };