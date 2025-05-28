export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Gagal melakukan fetch');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};
