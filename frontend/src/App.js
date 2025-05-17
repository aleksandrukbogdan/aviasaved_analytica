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
  InputLabel,
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
  Divider,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
import axios from 'axios';
import tickets from './components/tickets.json';

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

function Header({ selectedDepartment, onDepartmentChange, departmentList }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDepartments = departmentList.filter(dept =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.id}
            onClick={() => {
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              setMobileOpen(false);
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(43, 78, 152, 0.1)',
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, #2B4E98, #605BA2)',
          backdropFilter: 'blur(10px)',
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
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
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                color: '#FFFFFF',
                fontWeight: 'bold',
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
            flexGrow: { xs: 1, sm: 0 },
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
      
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Постоянное навигационное меню для десктопа */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'fixed',
            height: '100vh',
            top: 64,
            zIndex: theme.zIndex.drawer
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      
      <Toolbar />
    </Box>
  );
}

function App() {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFullRating, setShowFullRating] = useState(false);

  useEffect(() => {
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
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          Убедитесь, что сервер запущен и доступен по адресу http://localhost:8000
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
    if (department === 'all') {
      const departments = Object.keys(data.departmentTotals);
      return {
        labels: departments,
        datasets: [
          {
            label: 'Фактические расходы',
            data: departments.map(dept => data.departmentTotals[dept].spent),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            department: 'all'
          },
          {
            label: 'Оптимальные расходы',
            data: departments.map(dept => data.departmentTotals[dept].saved),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            department: 'all'
          }
        ]
      };
    }

    const departmentData = data.departments[department];
    const routes = [...new Set(departmentData.map(item => item.route))];
    
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: (context) => {
          const department = context.chart.data.datasets[0].department || 'all';
          return `Сравнение фактических и оптимальных расходов ${department === 'all' ? '(Все департаменты)' : `(Департамент: ${department})`}`;
        }
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
            return [
              `Маршрут: ${point.routes.join(', ')}`,
              `Стоимость: ${formatNumber(point.y)} руб.`,
              `Экономия: ${formatNumber(point.savings)} руб.`
            ];
          }
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
          tooltipFormat: 'dd.MM.yyyy HH:mm'
        },
        title: {
          display: true,
          text: 'Дата'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Стоимость (руб.)'
        },
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      },
      line: {
        tension: 0
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
          text: 'Дата'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Экономия (руб.)'
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          }
        }
      }
    }
  };

  // Функция для расчета рейтинга департамента
  const calculateDepartmentRating = (dept, totals) => {
    console.log(`Расчет рейтинга для департамента ${dept}:`, totals);
    // Нормализуем показатели от 0 до 1
    const maxSpent = Math.max(...Object.values(data.departmentTotals).map(d => d.spent));
    const maxSaved = Math.max(...Object.values(data.departmentTotals).map(d => d.saved));
    
    // Веса для разных показателей
    const weights = {
      savingsPercentage: 0.4,    // Процент экономии
      savingsAmount: 0.3,        // Сумма экономии
      efficiency: 0.3            // Эффективность расходов
    };

    // Расчет процента экономии (0-1)
    const savingsPercentage = totals.saved / totals.spent;
    
    // Нормализованная сумма экономии (0-1)
    const normalizedSavings = totals.saved / maxSaved;
    
    // Эффективность расходов (0-1)
    // Чем меньше потрачено при той же экономии, тем выше эффективность
    const efficiency = 1 - (totals.spent / maxSpent);

    // Итоговый рейтинг
    const rating = (
      savingsPercentage * weights.savingsPercentage +
      normalizedSavings * weights.savingsAmount +
      efficiency * weights.efficiency
    ) * 100;

    return {
      rating: Math.round(rating),
      details: {
        savingsPercentage: (savingsPercentage * 100).toFixed(1),
        normalizedSavings: (normalizedSavings * 100).toFixed(1),
        efficiency: (efficiency * 100).toFixed(1)
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
      description: "Ваш рейтинг рассчитывается по формуле: (Процент экономии × 40%) + (Нормализованная сумма экономии × 30%) + (Эффективность расходов × 30%). Максимальный балл - 100!"
    });

    // Рекомендации по проценту экономии (40% веса)
    recommendations.push({
      title: "💡 Стратегия 1: Увеличиваем процент экономии",
      description: "Это самый важный показатель (40% веса)! Бронируйте билеты за 2-3 месяца до вылета - это даст вам до 30% экономии. Используйте гибкие даты и альтернативные аэропорты."
    });

    // Рекомендации по сумме экономии (30% веса)
    recommendations.push({
      title: "💰 Стратегия 2: Наращиваем сумму экономии",
      description: "Второй по важности показатель (30% веса). Объединяйте командировки в одном направлении, используйте программы лояльности авиакомпаний. Каждый сэкономленный рубль увеличивает ваш рейтинг!"
    });

    // Рекомендации по эффективности (30% веса)
    recommendations.push({
      title: "⚡ Стратегия 3: Повышаем эффективность",
      description: "Третий ключевой показатель (30% веса). Планируйте командировки в непиковые сезоны, используйте стыковочные рейсы. Чем меньше вы тратите при той же экономии, тем выше эффективность!"
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

    // Сезонные рекомендации
    

    

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
    backdropFilter: 'blur(10px)',
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
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(43, 78, 152, 0.1) 0%, rgba(96, 91, 162, 0.1) 100%)',
        py: 4
      }}>
        <Header 
          selectedDepartment={selectedDepartment}
          onDepartmentChange={handleDepartmentChange}
          departmentList={data?.departmentList || []}
        />
        <Container 
          maxWidth="lg" 
          sx={{ 
            ml: { sm: '250px' }, // Отступ для навигационного меню
            width: { sm: `calc(100% - 250px)` }, // Ширина контейнера с учетом меню
            transition: 'margin 0.2s ease-in-out'
          }}
        >
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
                mb: 4
              }}
            >
              Аналитика экономии на авиабилетах
            </Typography>

            <Grid container spacing={3}>
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
                  <Box sx={{ height: 400, position: 'relative' }}>
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
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} руб.`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Сумма стоимости (руб.)'
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          x: {
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
                    Динамика цен по времени
                  </Typography>
                  <Box sx={{ height: 400, position: 'relative' }}>
                    <Scatter data={getScatterData(selectedDepartment)} options={scatterOptions} />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={cardStyle}>
                  <Typography variant="h6" component="h2" sx={titleStyle} align="center">
                    Сравнение фактических и оптимальных расходов
                  </Typography>
                  <Box sx={{ height: 400, position: 'relative' }}>
                    <Bar data={getBarData(selectedDepartment)} options={barOptions} />
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
                  <Box sx={{ height: 400, position: 'relative' }}>
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
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 