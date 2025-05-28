import { useEffect, useState } from 'react';
import MapComponent from '../../components/fragments/home/MapComponent';
import CONFIG from '../../config/config';
import { fetchData } from '../../utils/utils';

const HomePage = () => {
  const [infrastrukturData, setInfrastrukturData] = useState([]);
  const [loading, setLoading] = useState(true);
  // get data infrastruktur
  useEffect(() => {
    const getData = async () => {
      try {
        const { status, data, message } = await fetchData(
          `${CONFIG.API_URL}/infrastrukturs`
        );
        if (status !== 'success') {
          throw new Error(message);
        }
        setInfrastrukturData(data);
      } catch (error) {
        console.log('fetch infrastruktur', error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) return null;

  return <MapComponent infrastrukturData={infrastrukturData} />;
};

export default HomePage;
