import { ActivityCategory } from '../types';

export interface LocationItem {
  name: string;
  aliases?: string[];
  address: string;
  lat: number;
  lng: number;
  category: ActivityCategory;
  city?: string;
}

export const TAIWAN_PLACES: LocationItem[] = [
  // 花蓮
  {
    name: '花蓮遠雄海洋公園',
    aliases: ['遠雄海洋公園', '海洋公園', '花蓮海洋公園'],
    address: '花蓮縣壽豐鄉鹽寮村福德 189 號',
    lat: 23.9016,
    lng: 121.6033,
    category: 'attraction',
    city: '花蓮縣',
  },
  {
    name: '七星潭海岸風景區',
    aliases: ['七星潭', '七星潭海灘'],
    address: '花蓮縣新城鄉海岸路',
    lat: 24.0305,
    lng: 121.6294,
    category: 'attraction',
    city: '花蓮縣',
  },
  {
    name: '太魯閣國家公園 (燕子口)',
    aliases: ['太魯閣', '太魯閣國家公園', '燕子口'],
    address: '花蓮縣秀林鄉富世村富世 291 號',
    lat: 24.1714,
    lng: 121.5647,
    category: 'attraction',
    city: '花蓮縣',
  },
  {
    name: '東大門國際觀光夜市',
    aliases: ['東大門夜市', '花蓮東大門', '花蓮夜市'],
    address: '花蓮縣花蓮市中山路 50 號',
    lat: 23.9734,
    lng: 121.6133,
    category: 'food',
    city: '花蓮縣',
  },
  {
    name: '花蓮理想大地渡假飯店',
    aliases: ['理想大地', '理想大地飯店', '理想大地渡假飯店'],
    address: '花蓮縣壽豐鄉理想路 1 號',
    lat: 23.8647,
    lng: 121.5168,
    category: 'stay',
    city: '花蓮縣',
  },
  {
    name: '瑞穗牧場',
    aliases: ['花蓮瑞穗牧場', '瑞穗'],
    address: '花蓮縣瑞穗鄉舞鶴村 6 鄰 157 號',
    lat: 23.4981,
    lng: 121.3653,
    category: 'attraction',
    city: '花蓮縣',
  },
  {
    name: '台泥 DAKA 園區',
    aliases: ['台泥DAKA', 'DAKA園區', '和平星巴克'],
    address: '花蓮縣秀林鄉和平村和平 263 號',
    lat: 24.3056,
    lng: 121.7583,
    category: 'attraction',
    city: '花蓮縣',
  },
  {
    name: '花蓮液香扁食',
    aliases: ['液香扁食', '花蓮扁食'],
    address: '花蓮縣花蓮市信義街 42 號',
    lat: 23.9765,
    lng: 121.6052,
    category: 'food',
    city: '花蓮縣',
  },
  {
    name: '花蓮鯉魚潭風景區',
    aliases: ['鯉魚潭', '花蓮鯉魚潭'],
    address: '花蓮縣壽豐鄉池南村環潭北路 100 號',
    lat: 23.9312,
    lng: 121.5085,
    category: 'attraction',
    city: '花蓮縣',
  },

  // 台東
  {
    name: '池上伯朗大道 (金城武樹)',
    aliases: ['伯朗大道', '池上伯朗大道', '金城武樹', '天堂之路'],
    address: '台東縣池上鄉錦新三號道路',
    lat: 23.1251,
    lng: 121.2188,
    category: 'attraction',
    city: '台東縣',
  },
  {
    name: '台東知本老爺酒店',
    aliases: ['知本老爺', '知本老爺酒店', '知本溫泉'],
    address: '台東縣卑南鄉溫泉村龍泉路 113 巷 23 號',
    lat: 22.6953,
    lng: 120.9982,
    category: 'stay',
    city: '台東縣',
  },
  {
    name: '台東鹿野高台 (熱氣球)',
    aliases: ['鹿野高台', '熱氣球高台', '鹿野熱氣球'],
    address: '台東縣鹿野鄉高台路 46 號',
    lat: 22.9137,
    lng: 121.1198,
    category: 'attraction',
    city: '台東縣',
  },
  {
    name: '台東鐵花村音樂聚落',
    aliases: ['鐵花村', '鐵花新聚落'],
    address: '台東縣台東市新生路 135 巷 26 號',
    lat: 22.7523,
    lng: 121.1472,
    category: 'food',
    city: '台東縣',
  },
  {
    name: '台東三仙台風景區',
    aliases: ['三仙台', '三仙台跨海大橋'],
    address: '台東縣成功鎮基翬路 74 號',
    lat: 23.1264,
    lng: 121.4086,
    category: 'attraction',
    city: '台東縣',
  },
  {
    name: '台東多良車站',
    aliases: ['多良車站', '最美車站'],
    address: '台東縣太麻里鄉多良村瀧 41 號',
    lat: 22.5072,
    lng: 120.9602,
    category: 'attraction',
    city: '台東縣',
  },

  // 宜蘭
  {
    name: '宜蘭傳藝園區 (國立傳統藝術中心)',
    aliases: ['傳藝中心', '宜蘭傳藝', '傳統藝術中心'],
    address: '宜蘭縣五結鄉五濱路二段 201 號',
    lat: 24.6853,
    lng: 121.8242,
    category: 'attraction',
    city: '宜蘭縣',
  },
  {
    name: '礁溪老爺酒店',
    aliases: ['礁溪老爺', '礁溪老爺酒店'],
    address: '宜蘭縣礁溪鄉大忠村五峰路 69 號',
    lat: 24.8322,
    lng: 121.7589,
    category: 'stay',
    city: '宜蘭縣',
  },
  {
    name: '羅東夜市',
    aliases: ['羅東夜市', '羅東觀光夜市'],
    address: '宜蘭縣羅東鎮民生路 (羅東公園旁)',
    lat: 24.6766,
    lng: 121.7674,
    category: 'food',
    city: '宜蘭縣',
  },
  {
    name: '斑比山丘 (小鹿園區)',
    aliases: ['斑比山丘', '宜蘭小鹿'],
    address: '宜蘭縣冬山鄉下湖路 285 號',
    lat: 24.6465,
    lng: 121.7378,
    category: 'attraction',
    city: '宜蘭縣',
  },
  {
    name: '張美阿嬤農場',
    aliases: ['張美阿嬤', '張美阿嬤農場', '水豚農場'],
    address: '宜蘭縣三星鄉行健溪一路二段 161 號',
    lat: 24.6713,
    lng: 121.6835,
    category: 'attraction',
    city: '宜蘭縣',
  },

  // 雙北 / 基隆
  {
    name: '台北車站',
    aliases: ['台北車站', '北車', '台北高鐵站'],
    address: '台北市中正區北平西路 3 號',
    lat: 25.0478,
    lng: 121.5170,
    category: 'transport',
    city: '台北市',
  },
  {
    name: '台北 101 大樓觀景台',
    aliases: ['台北101', '101大樓', '台北101觀景台'],
    address: '台北市信義區信義路五段 7 號',
    lat: 25.0339,
    lng: 121.5645,
    category: 'attraction',
    city: '台北市',
  },
  {
    name: '台北市立動物園 (木柵動物園)',
    aliases: ['木柵動物園', '台北動物園', '貓熊館'],
    address: '台北市文山區新光路二段 30 號',
    lat: 24.9983,
    lng: 121.5810,
    category: 'attraction',
    city: '台北市',
  },
  {
    name: '國立故宮博物院',
    aliases: ['台北故宮', '故宮博物院', '故宮'],
    address: '台北市士林區至善路二段 221 號',
    lat: 25.1023,
    lng: 121.5485,
    category: 'attraction',
    city: '台北市',
  },
  {
    name: '九份老街 (阿妹茶樓)',
    aliases: ['九份老街', '九份', '阿妹茶樓'],
    address: '新北市瑞芳區基山街',
    lat: 25.1099,
    lng: 121.8447,
    category: 'attraction',
    city: '新北市',
  },
  {
    name: '野柳地質公園 (女王頭)',
    aliases: ['野柳', '野柳女王頭', '野柳地質公園'],
    address: '新北市萬里區港東路 167-1 號',
    lat: 25.2064,
    lng: 121.6905,
    category: 'attraction',
    city: '新北市',
  },
  {
    name: '淡水老街與漁人碼頭',
    aliases: ['淡水老街', '漁人碼頭', '淡水渡船頭'],
    address: '新北市淡水區中正路 1 號',
    lat: 25.1698,
    lng: 121.4428,
    category: 'attraction',
    city: '新北市',
  },

  // 桃園 / 新竹 / 苗栗
  {
    name: 'Xpark 水生公園',
    aliases: ['Xpark', '桃園水族館', '橫濱水族館'],
    address: '桃園市中壢區春德路 105 號',
    lat: 25.0135,
    lng: 121.2144,
    category: 'attraction',
    city: '桃園市',
  },
  {
    name: '六福村主題遊樂園',
    aliases: ['六福村', '六福村水樂園'],
    address: '新竹縣關西鎮仁安里拱子溝 60 號',
    lat: 24.8239,
    lng: 121.1818,
    category: 'attraction',
    city: '新竹縣',
  },
  {
    name: '苗栗飛牛牧場',
    aliases: ['飛牛牧場', '苗栗牧場'],
    address: '苗栗縣通霄鎮南和里 166 號',
    lat: 24.4533,
    lng: 120.7301,
    category: 'attraction',
    city: '苗栗縣',
  },

  // 台中 / 南投
  {
    name: '麗寶樂園渡假區',
    aliases: ['麗寶樂園', '麗寶摩天輪', '馬拉灣'],
    address: '台中市后里區福容路 8 號',
    lat: 24.3235,
    lng: 120.6974,
    category: 'attraction',
    city: '台中市',
  },
  {
    name: '高美濕地景觀步道',
    aliases: ['高美濕地', '高美木棧道'],
    address: '台中市清水區美堤街',
    lat: 24.3122,
    lng: 120.5501,
    category: 'attraction',
    city: '台中市',
  },
  {
    name: '逢甲觀光夜市',
    aliases: ['逢甲夜市', '逢甲大學夜市'],
    address: '台中市西屯區文華路',
    lat: 24.1798,
    lng: 120.6453,
    category: 'food',
    city: '台中市',
  },
  {
    name: '日月潭向山遊客中心',
    aliases: ['日月潭', '向山遊客中心', '伊達邵碼頭'],
    address: '南投縣魚池鄉中山路 599 號',
    lat: 23.8524,
    lng: 120.9022,
    category: 'attraction',
    city: '南投縣',
  },
  {
    name: '清境農場青青草原',
    aliases: ['清境農場', '青青草原', '清境天空步道'],
    address: '南投縣仁愛鄉仁和路 170 號',
    lat: 24.0585,
    lng: 121.1627,
    category: 'attraction',
    city: '南投縣',
  },

  // 嘉義 / 台南
  {
    name: '阿里山國家森林遊樂區',
    aliases: ['阿里山', '祝山日出', '巨木群棧道'],
    address: '嘉義縣阿里山鄉中正村 59 號',
    lat: 23.5113,
    lng: 120.8037,
    category: 'attraction',
    city: '嘉義縣',
  },
  {
    name: '奇美博物館',
    aliases: ['奇美博物館', '奇美', '台南奇美'],
    address: '台南市仁德區文華路二段 66 號',
    lat: 22.9347,
    lng: 120.2260,
    category: 'attraction',
    city: '台南市',
  },
  {
    name: '台南安平古堡與老街',
    aliases: ['安平古堡', '安平老街', '安平樹屋'],
    address: '台南市安平區國勝路 82 號',
    lat: 23.0016,
    lng: 120.1606,
    category: 'attraction',
    city: '台南市',
  },
  {
    name: '花園夜市',
    aliases: ['台南花園夜市', '花園夜市'],
    address: '台南市北區海安路三段 533 號',
    lat: 23.0110,
    lng: 120.2001,
    category: 'food',
    city: '台南市',
  },

  // 高雄 / 屏東
  {
    name: '駁二藝術特區',
    aliases: ['駁二', '駁二特區', '棧貳庫'],
    address: '高雄市鹽埕區大勇路 1 號',
    lat: 22.6200,
    lng: 120.2818,
    category: 'attraction',
    city: '高雄市',
  },
  {
    name: '義大世界遊樂區',
    aliases: ['義大世界', '義大摩天輪', '義大購物廣場'],
    address: '高雄市大樹區學城路一段 10 號',
    lat: 22.7303,
    lng: 120.4072,
    category: 'attraction',
    city: '高雄市',
  },
  {
    name: '國立海洋生物博物館 (墾丁海生館)',
    aliases: ['墾丁海生館', '海生館', '車城海生館'],
    address: '屏東縣車城鄉後灣路 2 號',
    lat: 22.0461,
    lng: 120.6987,
    category: 'attraction',
    city: '屏東縣',
  },
  {
    name: '墾丁大街觀光夜市',
    aliases: ['墾丁大街', '墾丁夜市'],
    address: '屏東縣恆春鎮墾丁路',
    lat: 21.9452,
    lng: 120.7981,
    category: 'food',
    city: '屏東縣',
  },
  {
    name: '鵝鑾鼻公園燈塔',
    aliases: ['鵝鑾鼻燈塔', '台灣最南端', '鵝鑾鼻公園'],
    address: '屏東縣恆春鎮鵝鑾里燈塔路 90 號',
    lat: 21.9023,
    lng: 120.8525,
    category: 'attraction',
    city: '屏東縣',
  },
];

/**
 * 搜尋台灣地點資料庫
 */
export function searchLocalPlaces(keyword: string): LocationItem[] {
  if (!keyword || keyword.trim().length === 0) return [];
  const cleanKey = keyword.trim().toLowerCase();

  return TAIWAN_PLACES.filter((p) => {
    if (p.name.toLowerCase().includes(cleanKey)) return true;
    if (p.address.toLowerCase().includes(cleanKey)) return true;
    if (p.aliases?.some((a) => a.toLowerCase().includes(cleanKey))) return true;
    return false;
  });
}

/**
 * 線上即時地理編碼搜尋 (以 OpenStreetMap / Photon 支援中文)
 */
export async function searchOnlineGeocoding(keyword: string): Promise<LocationItem[]> {
  if (!keyword || keyword.trim().length < 2) return [];

  try {
    const q = encodeURIComponent(keyword.trim());
    // 使用 Photon API (Komoot 提供的 OSM 全球地理編碼，支援繁體中文且無 CORS 限制)
    const url = `https://photon.komoot.io/api/?q=${q}&limit=5&lang=default`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !data.features || data.features.length === 0) return [];

    return data.features.map((f: any) => {
      const props = f.properties || {};
      const coords = f.geometry?.coordinates || [0, 0];
      const lng = coords[0];
      const lat = coords[1];

      // 組裝繁體地址
      const parts = [
        props.country,
        props.state || props.county,
        props.city || props.district,
        props.street,
        props.housenumber,
      ].filter(Boolean);

      const formattedAddress = parts.join('') || props.name || keyword;

      // 判斷分類
      let category: ActivityCategory = 'attraction';
      const nameLower = (props.name || '').toLowerCase();
      if (nameLower.includes('飯店') || nameLower.includes('酒店') || nameLower.includes('民宿') || nameLower.includes('旅館') || nameLower.includes('hotel')) {
        category = 'stay';
      } else if (nameLower.includes('夜市') || nameLower.includes('餐廳') || nameLower.includes('小吃') || nameLower.includes('麵') || nameLower.includes('牛肉') || nameLower.includes('咖啡') || nameLower.includes('美食')) {
        category = 'food';
      } else if (nameLower.includes('站') || nameLower.includes('高鐵') || nameLower.includes('機場') || nameLower.includes('轉運')) {
        category = 'transport';
      }

      return {
        name: props.name || keyword,
        address: formattedAddress,
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        category,
      };
    });
  } catch (err) {
    console.warn('線上 Geocoding 查詢略過:', err);
    return [];
  }
}
