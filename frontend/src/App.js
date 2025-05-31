import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Grid, 
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  Button,
  useTheme,
  alpha,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Collapse,
  TextField,
  InputAdornment
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar, Pie, Scatter, Line } from 'react-chartjs-2';
import SearchIcon from '@mui/icons-material/Search';

// Регистрируем все необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Создаем тему с фирменными цветами
const theme = createTheme({
  palette: {
    primary: {
      main: '#2B4E98',
      light: '#6CC7EF',
      dark: '#1A3B7A',
    },
    secondary: {
      main: '#605BA2',
      light: '#8A85C4',
      dark: '#4A4582',
    },
    text: {
      primary: '#4B4B4C',
      secondary: '#AEAEAF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Jura", sans-serif',
    h1: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          fontFamily: '"Jura", sans-serif !important',
        },
        'h1, h2, h3, h4, h5, h6': {
          fontFamily: '"Noto Sans SC", sans-serif !important',
        },
        '.MuiTypography-root': {
          fontFamily: '"Jura", sans-serif !important',
        },
        '.MuiTypography-h1, .MuiTypography-h2, .MuiTypography-h3, .MuiTypography-h4, .MuiTypography-h5, .MuiTypography-h6': {
          fontFamily: '"Noto Sans SC", sans-serif !important',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2B4E98, #605BA2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          borderRight: '1px solid rgba(43, 78, 152, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(43, 78, 152, 0.1)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-h1, &.MuiTypography-h2, &.MuiTypography-h3, &.MuiTypography-h4, &.MuiTypography-h5, &.MuiTypography-h6': {
            fontFamily: '"Noto Sans SC", sans-serif !important',
          },
        },
      },
    },
  },
});

// Добавляем функцию форматирования чисел
const formatNumber = (number) => {
  return new Intl.NumberFormat('ru-RU').format(Math.round(number));
};

function Header({ selectedDepartment, onDepartmentChange, departmentList, onDrawerToggle }) {
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { text: 'Рейтинг департаментов', icon: <StarIcon />, id: 'rating' },
    { text: 'Рекомендации', icon: <LightbulbIcon />, id: 'recommendations' },
    { text: 'Распределение затрат', icon: <PieChartIcon />, id: 'distribution' },
    { text: 'Средняя стоимость', icon: <BarChartIcon />, id: 'average' },
    { text: 'Динамика по неделям', icon: <TimelineIcon />, id: 'weekly' },
    { text: 'Статистика', icon: <BarChartIcon />, id: 'statistics' }
  ];

  const filteredDepartments = departmentList.filter(dept =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, #2B4E98, #605BA2)',
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            flexGrow: 1
          }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="Логотип"
              sx={{
                height: 40,
                width: 'auto',
                display: { xs: 'none', sm: 'block' }
              }}
            />
            
            <Typography
              variant="subtitle1"
              noWrap
              component="div"
              sx={{ 
                color: '#FFFFFF',
                fontWeight: 'normal',
                marginLeft: '15px',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Группа углубленной аналитики
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            flexGrow: { xs: 0, sm: 0 },
            justifyContent: { xs: 'flex-end', sm: 'flex-start' }
          }}>
            <Typography
              variant="subtitle1"
              sx={{ 
                mr: 2,
                color: 'white',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Выберите департамент:
            </Typography>
            
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFFFFF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              <Select
                value={selectedDepartment}
                onChange={onDepartmentChange}
                label="Выберите департамент"
                sx={{
                  color: '#2B4E98',
                  '& .MuiSelect-select': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                <MenuItem value="all">Все департаменты</MenuItem>
                {filteredDepartments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Toolbar />
    </Box>
  );
}

function RouteOptimalDaysTable({ data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const INITIAL_ROUTES_COUNT = 7;

  // Добавляем логирование данных
  console.log('RouteOptimalDaysTable data:', data);

  // Фильтрация данных по поисковому запросу
  const filteredData = data.filter(item => 
    item.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Определяем отображаемые данные
  const displayedData = showAllRoutes ? filteredData : filteredData.slice(0, INITIAL_ROUTES_COUNT);
  const hasMoreRoutes = filteredData.length > INITIAL_ROUTES_COUNT;

  // Обработчик сворачивания таблицы
  const handleCollapse = () => {
    if (isExpanded) {
      // При сворачивании сбрасываем все состояния
      setShowAllRoutes(false);
      setSearchQuery('');
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <Grid item xs={12}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Рекомендации по срокам покупки билетов
          </Typography>
          <Button
            onClick={handleCollapse}
            variant="outlined"
            sx={{ minWidth: 140 }}
          >
            {isExpanded ? 'Свернуть ▼' : 'Развернуть ▲'}
          </Button>
        </Box>
        
        <Collapse in={isExpanded}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Поиск по маршрутам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Маршрут</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Рекомендация</th>
                  <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Оптимальная стоимость</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{item.route}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                      Купить билет не позднее чем за {item.optimalDay} {getDayWord(item.optimalDay)} до вылета
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #ddd', 
                      textAlign: 'right',
                      color: '#2e7d32',
                      fontWeight: 'bold'
                    }}>
                      {formatNumber(item.optimalPrice)} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hasMoreRoutes && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  onClick={() => setShowAllRoutes(!showAllRoutes)}
                  variant="text"
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(43, 78, 152, 0.1)'
                    }
                  }}
                >
                  {showAllRoutes ? `Показать ${INITIAL_ROUTES_COUNT} основных маршрутов` : `Показать все маршруты (${filteredData.length})`}
                </Button>
              </Box>
            )}
            {filteredData.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  Маршруты не найдены
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Grid>
  );
}

// Функция для правильного склонения слова "день"
function getDayWord(number) {
  const cases = [2, 0, 1, 1, 1, 2];
  const titles = ['день', 'дня', 'дней'];
  return titles[
    (number % 100 > 4 && number % 100 < 20) 
    ? 2 
    : cases[(number % 10 < 5) ? number % 10 : 5]
  ];
}



function App() {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFullRating, setShowFullRating] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null);
  const [departmentsData, setDepartmentsData] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Рейтинг департаментов', icon: <StarIcon />, id: 'rating' },
    { text: 'Рекомендации', icon: <LightbulbIcon />, id: 'recommendations' },
    { text: 'Распределение затрат', icon: <PieChartIcon />, id: 'distribution' },
    { text: 'Средняя стоимость', icon: <BarChartIcon />, id: 'average' },
    { text: 'Динамика по неделям', icon: <TimelineIcon />, id: 'weekly' },
    { text: 'Статистика', icon: <BarChartIcon />, id: 'statistics' }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.id}
            onClick={() => {
              const element = document.getElementById(item.id);
              if (element) {
                const headerOffset = 84; // Высота хедера
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(43, 78, 152, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(43, 78, 152, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(43, 78, 152, 0.3)',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#2B4E98' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                color: '#4B4B4C',
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const fetchData = async () => {
    try {
      console.log('Начинаем загрузку данных...');
      const response = await fetch('http://localhost:8000/api/data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Ошибка: сервер вернул не JSON данные!");
      }
      const jsonData = await response.json();
      console.log('Данные успешно загружены:', jsonData);
      setData(jsonData);
      setDepartmentList(jsonData.departmentList || []);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Эффект для обновления данных при изменении департамента
  useEffect(() => {
    if (!data) return;

    // Получаем топ-10 департаментов по количеству полетов
    const topDepartments = Object.entries(data.departmentFlightsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([dept]) => dept);

    const departments = selectedDepartment === 'all' 
      ? topDepartments
      : [selectedDepartment];

    // Функция для расчета средневзвешенного времени для департамента
    const calculateWeightedOptimalDay = (dept) => {
      const deptData = data.departments[dept];
      const routes = [...new Set(deptData.map(item => item.route))];
      
      const routeFlightsCount = routes.reduce((acc, route) => {
        acc[route] = deptData.filter(item => item.route === route).length;
        return acc;
      }, {});

      const routeOptimalDays = routes.map(route => {
        const optimalDay = data.routeOptimalDays.find(r => r.route === route);
        return {
          route,
          optimalDay: optimalDay ? optimalDay.optimalDay : 0,
          flightsCount: routeFlightsCount[route]
        };
      });

      const totalFlights = routeOptimalDays.reduce((sum, r) => sum + r.flightsCount, 0);
      const weightedOptimalDay = routeOptimalDays.reduce((sum, r) => 
        sum + (r.optimalDay * r.flightsCount), 0) / totalFlights;

      return {
        dept,
        actualDays: data.departmentBookingDays[dept],
        weightedOptimalDay: Math.round(weightedOptimalDay * 10) / 10,
        routeDetails: routeOptimalDays
      };
    };

    const departmentsData = departments.map(dept => calculateWeightedOptimalDay(dept));
    setDepartmentsData(departmentsData);

    if (selectedDepartment !== 'all') {
      setRouteDetails(departmentsData[0].routeDetails);
    } else {
      setRouteDetails(null);
    }
  }, [selectedDepartment, data]);

  if (loading) return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6">Загрузка данных...</Typography>
      </Box>
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Ошибка: {error}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Убедитесь, что сервер запущен и доступен по адресу http://backend:8000
        </Typography>
      </Box>
    </Container>
  );
  
  if (!data) return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6">Нет данных для отображения</Typography>
      </Box>
    </Container>
  );

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const getScatterData = (department) => {
    const processData = (dataArray) => {
      // Группируем данные по дате
      const groupedByDate = dataArray.reduce((acc, point) => {
        const date = new Date(point.time).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            actual_sum: 0,
            optimal_sum: 0,
            routes: new Set(),
            savings_sum: 0
          };
        }
        acc[date].actual_sum += point.actual_price;
        acc[date].optimal_sum += point.optimal_price;
        acc[date].routes.add(point.route);
        acc[date].savings_sum += point.savings;
        return acc;
      }, {});

      // Преобразуем в массив и сортируем по дате
      return Object.entries(groupedByDate)
        .map(([date, data]) => ({
          x: new Date(date),
          y: data.actual_sum,
          optimal_y: data.optimal_sum,
          routes: Array.from(data.routes),
          savings: data.savings_sum
        }))
        .sort((a, b) => a.x - b.x);
    };

    if (department === 'all') {
      const allData = Object.values(data.departments).flat();
      const processedData = processData(allData);
      
      return {
        datasets: [{
          label: 'Фактическая стоимость',
          data: processedData.map(point => ({
            x: point.x,
            y: point.y,
            routes: point.routes,
            savings: point.savings
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          type: 'line',
          department: 'all'
        },
        {
          label: 'Оптимальная стоимость',
          data: processedData.map(point => ({
            x: point.x,
            y: point.optimal_y,
            routes: point.routes,
            savings: point.savings
          })),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          type: 'line',
          department: 'all'
        }]
      };
    }

    const departmentData = data.departments[department];
    const processedData = processData(departmentData);

    return {
      datasets: [{
        label: 'Фактическая стоимость',
        data: processedData.map(point => ({
          x: point.x,
          y: point.y,
          routes: point.routes,
          savings: point.savings
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        type: 'line',
        department: department
      },
      {
        label: 'Оптимальная стоимость',
        data: processedData.map(point => ({
          x: point.x,
          y: point.optimal_y,
          routes: point.routes,
          savings: point.savings
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        type: 'line',
        department: department
      }]
    };
  };

  const getPieData = () => {
    const departments = Object.keys(data.departmentTotals);
    return {
      labels: departments,
      datasets: [{
        label: 'Расходы по департаментам',
        data: departments.map(dept => data.departmentTotals[dept].spent),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
        department: 'all'
      }]
    };
  };

  const getBarData = (department) => {
    if (!data || !data.departmentFlightsCount || !data.departmentTotals) return null;

    if (department === 'all') {
      // Получаем топ-10 департаментов по количеству полетов
      const topDepartments = Object.entries(data.departmentFlightsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([dept]) => dept);

      if (topDepartments.length === 0) return null;

      return {
        labels: topDepartments,
        datasets: [
          {
            label: 'Фактические расходы',
            data: topDepartments.map(dept => data.departmentTotals[dept].spent),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            department: 'all'
          },
          {
            label: 'Оптимальные расходы',
            data: topDepartments.map(dept => data.departmentTotals[dept].saved),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            department: 'all'
          }
        ]
      };
    }

    if (!data.departments[department]) return null;

    const departmentData = data.departments[department];
    const routes = [...new Set(departmentData.map(item => item.route))];
    
    if (routes.length === 0) return null;

    return {
      labels: routes,
      datasets: [
        {
          label: 'Фактические расходы',
          data: routes.map(route => {
            const routeData = departmentData.filter(item => item.route === route);
            return routeData.reduce((sum, item) => sum + item.actual_price, 0);
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          department: department
        },
        {
          label: 'Оптимальные расходы',
          data: routes.map(route => {
            const routeData = departmentData.filter(item => item.route === route);
            return routeData.reduce((sum, item) => sum + item.optimal_price, 0);
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          department: department
        }
      ]
    };
  };

  // Функция для создания данных графика расходов по сотрудникам
  const getEmployeeBarData = () => {
    const employees = Object.entries(data.employeeTotals)
      .sort((a, b) => b[1].rating - a[1].rating)
      .slice(0, 10); // Берем топ-10 сотрудников

    return {
      labels: employees.map(([employee]) => employee),
      datasets: [
        {
          label: 'Фактические расходы',
          data: employees.map(([, data]) => data.spent),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Оптимальные расходы',
          data: employees.map(([, data]) => data.saved),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Обновляем настройки для всех графиков
  const commonFontSettings = {
    family: '"Jura", sans-serif',
    weight: 600
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: (context) => {
          const department = context.chart.data.datasets[0].department || 'all';
          return `Сравнение фактических и оптимальных расходов ${department === 'all' ? '(Топ-10 департаментов по количеству полетов)' : `(Департамент: ${department})`}`;
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatNumber(context.raw)} руб.`;
          }
        },
        titleFont: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        },
        bodyFont: commonFontSettings
      },
      legend: {
        labels: {
          font: commonFontSettings
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Сумма (руб.)',
          font: commonFontSettings
        },
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          },
          font: commonFontSettings
        }
      },
      x: {
        ticks: {
          font: commonFontSettings
        }
      }
    }
  };

  // Опции для графика расходов по сотрудникам
  const employeeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Топ-10 сотрудников по расходам'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatNumber(context.raw)} руб.`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Сумма (руб.)'
        },
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  const getSavingsLineData = (department) => {
    const processData = (dataArray) => {
      const groupedByDate = dataArray.reduce((acc, point) => {
        const date = new Date(point.time).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            savings: 0,
            routes: new Set()
          };
        }
        acc[date].savings += point.savings;
        acc[date].routes.add(point.route);
        return acc;
      }, {});

      return Object.entries(groupedByDate)
        .map(([date, data]) => ({
          x: new Date(date),
          y: data.savings,
          routes: Array.from(data.routes)
        }))
        .sort((a, b) => a.x - b.x);
    };

    if (department === 'all') {
      const allData = Object.values(data.departments).flat();
      const processedData = processData(allData);
      
      return {
        datasets: [{
          label: 'Экономия',
          data: processedData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0,
          department: 'all'
        }]
      };
    }

    const departmentData = data.departments[department];
    const processedData = processData(departmentData);

    return {
      datasets: [{
        label: 'Экономия',
        data: processedData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0,
        department: department
      }]
    };
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: (context) => {
          const department = context.chart.data.datasets[0].department || 'all';
          return `Динамика стоимости билетов по времени ${department === 'all' ? '(Все департаменты)' : `(Департамент: ${department})`}`;
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.raw;
            if (context.dataset.label === 'Фактическая стоимость') {
              return [
                `Маршрут: ${point.routes.join(', ')}`,
                `Стоимость: ${formatNumber(point.y)} руб.`
              ];
            } else {
              return [
                `Маршрут: ${point.routes.join(', ')}`,
                `Стоимость: ${formatNumber(point.y)} руб.`,
                `Экономия: ${formatNumber(point.savings)} руб.`
              ];
            }
          }
        },
        titleFont: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        },
        bodyFont: commonFontSettings
      },
      legend: {
        labels: {
          font: commonFontSettings
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd.MM.yyyy'
          },
          tooltipFormat: 'dd.MM.yyyy'
        },
        title: {
          display: true,
          text: 'Дата',
          font: commonFontSettings
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: commonFontSettings
        }
      },
      y: {
        title: {
          display: true,
          text: 'Стоимость (руб.)',
          font: commonFontSettings
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          },
          font: commonFontSettings
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 4
      },
      line: {
        tension: 0.05
      }
    }
  };

  // Функция для создания данных графика процента экономии
  const getSavingsPercentageData = (department) => {
    const departmentData = department === 'all' 
      ? Object.values(data.departments).flat()
      : data.departments[department];

    const totalSpent = departmentData.reduce((sum, item) => sum + item.actual_price, 0);
    const totalSaved = departmentData.reduce((sum, item) => sum + (item.actual_price - item.optimal_price), 0);

    return {
      labels: ['Экономия', 'Затраты'],
      datasets: [{
        data: [totalSaved, totalSpent],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
        department: department
      }]
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: (context) => {
          const department = context.chart.data.datasets[0].department || 'all';
          return `Распределение затрат и экономии ${department === 'all' ? '(Все департаменты)' : `(Департамент: ${department})`}`;
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatNumber(value)} руб. (${percentage}%)`;
          }
        },
        titleFont: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        },
        bodyFont: commonFontSettings
      },
      legend: {
        labels: {
          font: commonFontSettings
        }
      }
    }
  };

  const savingsLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: (context) => {
          const department = context.chart.data.datasets[0].department || 'all';
          return `Динамика экономии по времени ${department === 'all' ? '(Все департаменты)' : `(Департамент: ${department})`}`;
        },
        font: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.raw;
            return [
              `Экономия: ${formatNumber(point.y)} руб.`,
              `Маршруты: ${point.routes.join(', ')}`
            ];
          }
        },
        titleFont: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        },
        bodyFont: commonFontSettings
      },
      legend: {
        labels: {
          font: commonFontSettings
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd.MM.yyyy'
          }
        },
        title: {
          display: true,
          text: 'Дата',
          font: commonFontSettings
        }
      },
      y: {
        title: {
          display: true,
          text: 'Экономия (руб.)',
          font: commonFontSettings
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          },
          font: commonFontSettings
        }
      }
    }
  };

  // Функция для расчета рейтинга департамента
  const calculateDepartmentRating = (dept, totals) => {
    console.log(`Расчет рейтинга для департамента ${dept}:`, totals);
    
    // Получаем количество полетов
    const flightsCount = totals.flights_count || 0;
    if (flightsCount === 0) return { rating: 0, details: {} };

    // Нормализуем показатели от 0 до 1
    const maxSpent = Math.max(...Object.values(data.departmentTotals).map(d => d.spent));
    const maxSaved = Math.max(...Object.values(data.departmentTotals).map(d => d.saved));
    const maxFlights = Math.max(...Object.values(data.departmentTotals).map(d => d.flights_count));
    
    // Веса для разных показателей
    const weights = {
      savingsPercentage: 0.4,    // Процент экономии
      savingsPerFlight: 0.3,     // Экономия на один полет
      bookingTime: 0.3           // Время покупки билета до вылета
    };

    // Расчет процента экономии (0-1)
    const savingsPercentage = totals.saved / totals.spent;
    
    // Расчет экономии на один полет (0-1)
    const savingsPerFlight = totals.saved / flightsCount;
    const maxSavingsPerFlight = maxSaved / maxFlights;
    const normalizedSavingsPerFlight = savingsPerFlight / maxSavingsPerFlight;
    
    // Расчет эффективности по времени покупки билета (0-1)
    const actualDays = data.departmentBookingDays[dept] || 0;
    const optimalDays = data.routeOptimalDays
      .filter(route => data.departments[dept]?.some(item => item.route === route.route))
      .reduce((sum, route) => sum + route.optimalDay, 0) / 
      (data.routeOptimalDays.filter(route => 
        data.departments[dept]?.some(item => item.route === route.route)
      ).length || 1);

    // Нормализуем разницу между фактическим и оптимальным временем
    // Максимальная разница в 30 дней считается как 0, совпадение считается как 1
    const timeEfficiency = Math.max(0, 1 - Math.abs(actualDays - optimalDays) / 30);

    // Итоговый рейтинг
    const rating = (
      savingsPercentage * weights.savingsPercentage +
      normalizedSavingsPerFlight * weights.savingsPerFlight +
      timeEfficiency * weights.bookingTime
    ) * 100;

    return {
      rating: Math.round(rating),
      details: {
        savingsPercentage: (savingsPercentage * 100).toFixed(1),
        savingsPerFlight: Math.round(savingsPerFlight),
        timeEfficiency: (timeEfficiency * 100).toFixed(1),
        actualDays: Math.round(actualDays),
        optimalDays: Math.round(optimalDays),
        flightsCount: flightsCount
      }
    };
  };

  // Функция для проверки и форматирования данных департамента
  const formatDepartmentData = (dept, totals) => {
    console.log(`Форматирование данных для департамента ${dept}:`, totals);
    const { rating, details } = calculateDepartmentRating(dept, totals);
    return {
      dept,
      rating,
      details,
      totals,
      flightsCount: totals.flights_count || 0
    };
  };

  // Функция для генерации общих рекомендаций
  const generateGeneralRecommendations = () => {
    const recommendations = [];
    const allDepartments = Object.entries(data.departmentTotals);
    
    // Анализ формулы рейтинга
    recommendations.push({
      title: "🎯 Как подняться в рейтинге?",
      description: "Ваш рейтинг рассчитывается по формуле: (Процент экономии × 40%) + (Экономия на один полет × 30%) + (Эффективность времени покупки × 30%). Максимальный балл - 100!"
    });

    // Рекомендации по проценту экономии (40% веса)
    recommendations.push({
      title: "💡 Стратегия 1: Увеличиваем процент экономии",
      description: "Это самый важный показатель (40% веса)! Бронируйте билеты за 2-3 месяца до вылета - это даст вам до 30% экономии. Используйте гибкие даты и альтернативные аэропорты."
    });

    // Рекомендации по экономии на полет (30% веса)
    recommendations.push({
      title: "💰 Стратегия 2: Экономия на каждый полет",
      description: "Второй по важности показатель (30% веса). Важна не общая сумма экономии, а сколько вы экономите на каждый полет. Используйте программы лояльности, выбирайте оптимальные даты и маршруты для каждого полета."
    });

    // Рекомендации по времени покупки (30% веса)
    recommendations.push({
      title: "⏰ Стратегия 3: Оптимизируем время покупки",
      description: "Третий ключевой показатель (30% веса). Покупайте билеты в оптимальное время для каждого маршрута. Чем ближе ваше время покупки к оптимальному, тем выше рейтинг!"
    });

    // Сравнение с лидерами
    const topDepartments = allDepartments
      .map(([dept, totals]) => {
        const { rating } = calculateDepartmentRating(dept, totals);
        return { dept, rating };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    if (topDepartments.length > 0) {
      recommendations.push({
        title: "🏆 Учимся у лидеров",
        description: `Топ-3 департамента: ${topDepartments.map(d => `${d.dept} (${d.rating} баллов)`).join(', ')}. Изучите их стратегии бронирования и адаптируйте под себя!`
      });
    }

    return recommendations;
  };

  // Функция для создания данных графика средней стоимости
  const getAverageTicketPriceData = (department) => {
    const departmentData = department === 'all' 
      ? Object.values(data.departments).flat()
      : data.departments[department];

    const avgActual = departmentData.reduce((sum, item) => sum + item.actual_price, 0) / departmentData.length;
    const avgOptimal = departmentData.reduce((sum, item) => sum + item.optimal_price, 0) / departmentData.length;

    return {
      labels: ['Средняя стоимость'],
      datasets: [
        {
          label: 'Фактическая',
          data: [avgActual],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          department: department
        },
        {
          label: 'Оптимальная',
          data: [avgOptimal],
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          department: department
        }
      ]
    };
  };

  // Функция для создания данных графика тренда по неделям
  const getWeeklyTrendData = (department) => {
    const departmentData = department === 'all' 
      ? Object.values(data.departments).flat()
      : data.departments[department];

    // Создаем объект для хранения данных по неделям
    const weeklyData = {};
    
    // Группируем данные по неделям
    departmentData.forEach(item => {
      const date = new Date(item.time);
      // Получаем начало недели (понедельник)
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = startOfWeek.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          actual: 0,
          optimal: 0
        };
      }
      weeklyData[weekKey].actual += item.actual_price;
      weeklyData[weekKey].optimal += item.optimal_price;
    });

    // Сортируем недели по дате
    const sortedWeeks = Object.keys(weeklyData).sort();

    // Получаем суммы по неделям
    const actualSums = sortedWeeks.map(week => weeklyData[week].actual);
    const optimalSums = sortedWeeks.map(week => weeklyData[week].optimal);

    // Форматируем даты для отображения
    const formattedLabels = sortedWeeks.map(week => {
      const date = new Date(week);
      return `Неделя ${date.getDate()}.${date.getMonth() + 1}`;
    });

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Фактическая стоимость',
          data: actualSums,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          tension: 0,
          department: department
        },
        {
          label: 'Оптимальная стоимость',
          data: optimalSums,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0,
          department: department
        }
      ]
    };
  };

  // Функция для создания данных графика времени до вылета
  const getBookingDaysData = () => {
    if (!departmentsData) return null;

    return {
      labels: departmentsData.map(d => d.dept),
      datasets: [
        {
          label: 'Среднее время до вылета (дни)',
          data: departmentsData.map(d => d.actualDays),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          department: selectedDepartment
        },
        {
          label: 'Средневзвешенное оптимальное время (дни)',
          data: departmentsData.map(d => d.weightedOptimalDay),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          department: selectedDepartment
        }
      ]
    };
  };

  const bookingDaysOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: (context) => {
          const department = context.chart.data.datasets[0].department || 'all';
          return `Среднее время до вылета ${department === 'all' ? '(Топ-10 департаментов по количеству полетов)' : `(Департамент: ${department})`}`;
        },
        font: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const label = context.dataset.label;
            if (label.includes('оптимальное')) {
              if (selectedDepartment === 'all') {
                return `${label}: ${value} дней`;
              } else if (routeDetails) {
                return [
                  `${label}: ${value} дней`,
                  'Детали по маршрутам:',
                  ...routeDetails.map(r => 
                    `${r.route}: ${r.optimalDay} дней (${r.flightsCount} полетов)`
                  )
                ];
              }
            }
            return `${label}: ${value} дней`;
          }
        },
        titleFont: {
          family: '"Noto Sans SC", sans-serif',
          weight: 700
        },
        bodyFont: commonFontSettings
      },
      legend: {
        labels: {
          font: commonFontSettings
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Дни до вылета',
          font: commonFontSettings
        },
        ticks: {
          font: commonFontSettings
        }
      },
      x: {
        ticks: {
          font: commonFontSettings
        }
      }
    }
  };

  // Стили для карточек
  const cardStyle = {
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
    background: alpha(theme.palette.background.paper, 0.9),
    borderRadius: 2,
  };

  // Стили для заголовков
  const titleStyle = {
    mb: 3,
    fontWeight: 600,
    color: theme.palette.text.primary,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    pb: 1,
  };

  // Стили для статистики
  const statStyle = {
    p: 2,
    borderRadius: 2,
    background: alpha(theme.palette.primary.main, 0.1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header 
          selectedDepartment={selectedDepartment}
          onDepartmentChange={handleDepartmentChange}
          departmentList={departmentList}
          onDrawerToggle={handleDrawerToggle}
        />
        
        

        {/* Постоянное навигационное меню для десктопа */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: '250px',
            flexShrink: 0,
            position: 'fixed',
            left: 0,
            top: 64,
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: '250px',
              background: '#FFFFFF',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              position: 'fixed',
              height: 'calc(100vh - 64px)',
              top: 64,
              left: 0,
              zIndex: theme.zIndex.drawer
            },
          }}
          open
        >
          <Box sx={{ 
            width: '250px',
            height: '100%',
            overflow: 'auto'
          }}>
            <List>
              {menuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.id}
                  onClick={() => {
                    const element = document.getElementById(item.id);
                    if (element) {
                      const headerOffset = 84; // Высота хедера
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(43, 78, 152, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(43, 78, 152, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(43, 78, 152, 0.3)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#2B4E98' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      color: '#4B4B4C',
                      fontWeight: 500
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Container 
          maxWidth="lg" 
          sx={{ 
            width: '100%',
            transition: 'margin 0.2s ease-in-out',
            mt: '84px',
            pb: 6,
            px: 0,
            '&.MuiContainer-root': {
              padding: 0
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Typography>Загрузка данных...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                textShadow: `2px 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                mb: 6 // Увеличиваем отступ после заголовка
              }}
            >
              Аналитика экономии на авиабилетах
            </Typography>

            <Grid container spacing={4}> {/* Увеличиваем отступы между элементами сетки */}
              {/* Рейтинг департаментов и рекомендации в одном ряду */}
              <Grid item xs={12} id="rating">
                <Grid container spacing={3}>
                  {/* Рейтинг департаментов */}
                  <Grid item xs={4}>
                    <Paper sx={cardStyle}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3 
                      }}>
                        <Typography variant="h5" component="h2" sx={titleStyle}>
                          {showFullRating ? 'Полный рейтинг департаментов' : 'Топ-10 департаментов по эффективности'}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => setShowFullRating(!showFullRating)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3
                          }}
                        >
                          {showFullRating ? 'Свернуть ▲' : 'Показать все ▼'}
                        </Button>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 2, 
                        overflowY: 'auto',
                        maxHeight: '750px',
                        pr: 2,
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.3),
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.5),
                          },
                        },
                      }}>
                        {Object.entries(data.departmentTotals)
                          .map(([dept, totals]) => formatDepartmentData(dept, totals))
                          .sort((a, b) => b.rating - a.rating)
                          .slice(0, showFullRating ? undefined : 10)
                          .map(({ dept, rating, details, totals, flightsCount }, index) => (
                            <Paper 
                              key={dept}
                              elevation={2} 
                              sx={{ 
                                p: 2,
                                width: '100%',
                                bgcolor: 'background.default',
                                borderLeft: '4px solid',
                                borderColor: rating >= 70 ? 'success.main' : 
                                           rating >= 40 ? 'warning.main' : 
                                           'error.main',
                                position: 'relative',
                                transition: 'transform 0.2s'
                              }}
                            >
                              <Typography 
                                variant="subtitle2" 
                                component="span"
                                sx={{ 
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  color: 'text.secondary',
                                  fontSize: '0.875rem'
                                }}
                              >
                                #{index + 1}
                              </Typography>
                              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                                {dept}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                mb: 1
                              }}>
                                <Typography 
                                  variant="h4" 
                                  component="span"
                                  color={
                                    rating >= 70 ? 'success.main' : 
                                    rating >= 40 ? 'warning.main' : 
                                    'error.main'
                                  }
                                  fontWeight="bold"
                                >
                                  {rating}
                                </Typography>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  /100
                                </Typography>
                              </Box>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Экономия: {details.savingsPercentage}%
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Количество полетов: {totals.flights_count || 0}
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Потрачено: {formatNumber(totals.spent)} ₽
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Сэкономлено: {formatNumber(totals.saved)} ₽
                              </Typography>
                            </Paper>
                          ))}
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Общие рекомендации */}
                  <Grid item xs={8}>
                    <Paper sx={cardStyle}>
                      <Typography variant="h5" component="h2" sx={titleStyle} align="center">
                        Общие рекомендации по оптимизации
                      </Typography>
                      <Grid container spacing={2}>
                        {generateGeneralRecommendations().map((rec, index) => (
                          <Grid item xs={12} key={index}>
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                p: 2,
                                bgcolor: 'background.default',
                                borderLeft: '4px solid',
                                borderColor: 'primary.main',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                  transform: 'translateX(4px)',
                                }
                              }}
                            >
                              <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                                {rec.title}
                              </Typography>
                              <Typography variant="body1" component="p" color="text.secondary">
                                {rec.description}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Рейтинг сотрудников */}
              <Grid item xs={12} id="employee-rating">
                <Paper sx={cardStyle}>
                  <Typography variant="h5" component="h2" sx={titleStyle} align="center">
                    Рейтинг сотрудников по эффективности
                  </Typography>
                  <Typography variant="subtitle1" component="p" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Показываются только сотрудники из департаментов с более чем 10 полетами
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 2, 
                        overflowY: 'auto',
                        maxHeight: '600px',
                        pr: 2,
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.3),
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.5),
                          },
                        },
                      }}>
                        {Object.entries(data.employeeTotals)
                          .map(([employee, data]) => ({
                            employee,
                            ...data
                          }))
                          .sort((a, b) => b.rating - a.rating)
                          .map(({ employee, rating, details, department, tickets_count, spent, saved }, index) => (
                            <Paper 
                              key={employee}
                              elevation={2} 
                              sx={{ 
                                p: 2,
                                width: '100%',
                                bgcolor: 'background.default',
                                borderLeft: '4px solid',
                                borderColor: rating >= 70 ? 'success.main' : 
                                           rating >= 40 ? 'warning.main' : 
                                           'error.main',
                                position: 'relative',
                                transition: 'transform 0.2s',
                                
                              }}
                            >
                              <Typography 
                                variant="subtitle2" 
                                component="span"
                                sx={{ 
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  color: 'text.secondary',
                                  fontSize: '0.875rem'
                                }}
                              >
                                #{index + 1}
                              </Typography>
                              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                                {employee}
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary" gutterBottom>
                                Департамент: {department}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                mb: 1
                              }}>
                                <Typography 
                                  variant="h4" 
                                  component="span"
                                  color={
                                    rating >= 70 ? 'success.main' : 
                                    rating >= 40 ? 'warning.main' : 
                                    'error.main'
                                  }
                                  fontWeight="bold"
                                >
                                  {rating}
                                </Typography>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  /100
                                </Typography>
                              </Box>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Экономия: {details.savings_percentage}%
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Билетов: {tickets_count}
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Потрачено: {formatNumber(spent)} ₽
                              </Typography>
                              <Typography variant="body2" component="p" color="text.secondary">
                                Сэкономлено: {formatNumber(saved)} ₽
                              </Typography>
                            </Paper>
                          ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ height: '600px' }}>
                        <Bar data={getEmployeeBarData()} options={employeeBarOptions} />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

                {/* Таблица маршрутов */}
                {data && data.routeOptimalDays && data.routeOptimalDays.length > 0 && (
                  <RouteOptimalDaysTable data={data.routeOptimalDays} />
                )}

              
              {/* Новый график времени до вылета */}
              <Grid item xs={12}>
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Среднее время до вылета
                  </Typography>
                  <Box sx={{ height: 400, position: 'relative' }}>
                    {departmentsData && (
                      <Bar 
                        data={getBookingDaysData()}
                        options={bookingDaysOptions}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Сравнение фактических и оптимальных расходов
                  </Typography>
                  <Box sx={{ height: 500, position: 'relative' }}>
                    {getBarData(selectedDepartment) ? (
                      <Bar data={getBarData(selectedDepartment)} options={barOptions} />
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                      }}>
                        <Typography color="text.secondary">
                          Нет данных для отображения
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              {/* Новые графики */}
              <Grid item xs={12} md={6} id="distribution">
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Распределение затрат и экономии
                  </Typography>
                  <Box sx={{ height: 300, position: 'relative' }}>
                    <Pie data={getSavingsPercentageData(selectedDepartment)} options={pieOptions} />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} id="average">
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Средняя стоимость билета
                  </Typography>
                  <Box sx={{ height: 300, position: 'relative' }}>
                    <Bar 
                      data={getAverageTicketPriceData(selectedDepartment)}
                      options={barOptions}
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} id="weekly">
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Сумма стоимости по неделям
                  </Typography>
                  <Box sx={{ height: 500, position: 'relative' }}>
                    <Line 
                      data={getWeeklyTrendData(selectedDepartment)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          title: {
                            display: true,
                            text: (context) => {
                              const department = context.chart.data.datasets[0].department || 'all';
                              return `Сумма стоимости по неделям ${department === 'all' ? '(Все департаменты)' : `(Департамент: ${department})`}`;
                            },
                            font: {
                              family: '"Noto Sans SC", sans-serif',
                              weight: 600
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} руб.`;
                              }
                            }
                          },
                          legend: {
                            labels: {
                              font: commonFontSettings
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Сумма стоимости (руб.)',
                              font: commonFontSettings
                            },
                            ticks: {
                              callback: function(value) {
                                return formatNumber(value);
                              },
                              font: commonFontSettings
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          x: {
                            ticks: {
                              font: commonFontSettings
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          }
                        },
                        interaction: {
                          mode: 'index',
                          intersect: false
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>

              

              {/* Существующие графики */}
              <Grid item xs={12}>
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Динамика цен по дням
                  </Typography>
                  <Box sx={{ height: 500, position: 'relative' }}>
                    <Scatter data={getScatterData(selectedDepartment)} options={scatterOptions} />
                  </Box>
                </Paper>
              </Grid>

              

              <Grid item xs={12}>
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Динамика экономии по времени
                  </Typography>
                  <Box sx={{ height: 400, position: 'relative' }}>
                    <Line data={getSavingsLineData(selectedDepartment)} options={savingsLineOptions} />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} id="statistics">
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Общая статистика по экономии
                  </Typography>
                  <Box sx={{ height: 600, position: 'relative' }}>
                    <Pie data={getPieData()} options={pieOptions} />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={statStyle}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        Фактические расходы
                      </Typography>
                      <Typography variant="h4" component="p" color="primary" fontWeight="bold">
                        {formatNumber(data.totalSpent)} ₽
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        Оптимальная стоимость
                      </Typography>
                      <Typography variant="h4" component="p" color="success.main" fontWeight="bold">
                        {formatNumber(data.totalSaved)} ₽
                      </Typography>
                      <Typography variant="body2" component="p" color="text.secondary" sx={{ mt: 1 }}>
                        Потенциальная экономия: {formatNumber(data.totalSpent - data.totalSaved)} ₽
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 