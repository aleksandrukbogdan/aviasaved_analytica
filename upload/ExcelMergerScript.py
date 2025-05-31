import os
import sys
import argparse

import logging
from datetime import datetime, timedelta

import pandas as pd


def setup_logger(script_name: str, args: list):
    log_file = "scripts_execution.log"  # Все скрипты будут писать сюда

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.FileHandler(log_file, mode='a', encoding='utf-8'),
            logging.StreamHandler(sys.stdout)
        ]
    )

    logger = logging.getLogger(script_name)

    logger.info("")  # пустая строка для визуального разделения
    logger.info("")  # пустая строка для визуального разделения
    logger.info("")  # пустая строка для визуального разделения
    logger.info(f"=== Запуск скрипта: {script_name} ===")
    logger.info(f"Аргументы командной строки: {args}")

    return logger


if __name__ == '__main__':
    # Переменные стандартных путей к Excel файлам
    main_excel_file_path_std = "upload/upload.xlsx"
    opt_price_excel_file_path_std = "upload/optimal_prices_by_route.xlsx"

    # Парсинг аргументов
    parser = argparse.ArgumentParser(description="Импорт данных из Excel")
    parser.add_argument("--main-excel", "-me", default=main_excel_file_path_std, help="Путь к главному Excel-файлу")
    parser.add_argument("--opt-price-excel", "-ope", default=opt_price_excel_file_path_std, help="Путь к оптимальными ценами Excel-файлу")
    args = parser.parse_args()
    main_excel_file_path = args.main_excel
    opt_price_file_path = args.opt_price_excel

    # Инициализация логгера
    log = setup_logger(os.path.basename(__file__), [main_excel_file_path, opt_price_file_path])

    # Чтение Excel файла
    try:
        main_df = pd.read_excel(main_excel_file_path_std, engine="openpyxl")  # Чтение Excel с данными
    except FileNotFoundError:
        log.error(f"Файл не найден: {main_excel_file_path_std}")
        sys.exit(1)
    except Exception as e:
        log.exception(f"Ошибка при чтении Excel: {e}")
        sys.exit(1)

    # 2. Выделяем интересующие нас столбцы
    main_df = main_df[[
        "Дата и время покупки",
        "Время до вылета (дни)",
        "Время до вылета (часы)",
        "Дата и время отправления/заезда",
        "Продолжительность полета (часы)",
        "Дата и время прибытия/выезда",
        "Сезон",
        "Откуда (город)",
        "Население (откуда город)",
        "Куда (город)",
        "Население (куда город)",
        "Расстояние между городами",
        "Действие",
        "Услуга",
        "Тип услуги",
        "Стоимость",
        "Перевозчик",
        "Организация",
        "Департаменты",
        "Сотрудник",
        "Оформил",
        "Оплатил"
    ]]

    main_df['Маршрут'] = main_df.apply(lambda x: " ↔ ".join(sorted([x["Откуда (город)"], x["Куда (город)"]])), axis=1)


    # Чтение Excel файла
    try:
        opt_df = pd.read_excel(opt_price_file_path, engine="openpyxl")  # Чтение Excel с данными
    except FileNotFoundError:
        log.error(f"Файл не найден: {opt_price_file_path}")
        sys.exit(1)
    except Exception as e:
        log.exception(f"Ошибка при чтении Excel: {e}")
        sys.exit(1)

    opt_df = opt_df[[
        "Маршрут",
        #"Средняя цена (0-5 дней)"
        #"Средняя цена (6-15 дней)",
        "Средняя цена по рейсу",
        "Количество вылетов",
        "Оптимальная цена по рейсу",
        "Оптимальная цена по рейсу (альтернатива)",
        #"Разница с общим средним",
        #"Разница с общим средним (альтернатива)",
        "Ближайший день к оптимальной цене (0-7)",
        #"Средняя цена в этот день",
        "Оптимальный день (ср. цена)",
        #"Минимальная средняя цена"
    ]]

    result = pd.merge(
        main_df,
        opt_df,
        on=['Маршрут'],
        how='outer'
    )

    result = result[[
        "Дата и время покупки",
        "Время до вылета (дни)",
        "Время до вылета (часы)",
        "Дата и время отправления/заезда",
        "Продолжительность полета (часы)",
        "Дата и время прибытия/выезда",
        "Сезон",
        "Откуда (город)",
        "Население (откуда город)",
        "Куда (город)",
        "Население (куда город)",
        "Маршрут",
        "Количество вылетов",
        "Расстояние между городами",
        "Действие",
        "Услуга",
        "Тип услуги",
        "Стоимость",
        "Оптимальная цена по рейсу",
        "Оптимальная цена по рейсу (альтернатива)",
        "Средняя цена по рейсу",
        "Оптимальный день (ср. цена)",
        "Ближайший день к оптимальной цене (0-7)",
        "Перевозчик",
        "Организация",
        "Департаменты",
        "Сотрудник",
        "Оформил",
        "Оплатил"
    ]]

    # Сравнения стоимостей
    result["Разница между оптимальной ценой и стоимостью"] = result["Оптимальная цена по рейсу"] - result["Стоимость"]
    result["Разница между оптимальной ценой (альтернатива) и стоимостью"] = result["Оптимальная цена по рейсу (альтернатива)"] - result["Стоимость"]
    result["Разница между средней ценой и стоимостью"] = result["Средняя цена по рейсу"] - result["Стоимость"]

    # Удаляем строки с департаментом "Руководящий состав"
    result = result[result["Департаменты"] != "Руководящий состав"]
    log.info("Удалены строки с департаментом 'Руководящий состав'")

    output_path = 'upload/prices.xlsx'
    
    try:
        result.to_excel(output_path, index=False, engine='openpyxl')
        log.info(f"Результаты сохранены в файл: {output_path}")
    except PermissionError:
        # Если файл занят, создаем новый файл с временной меткой
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f'upload/prices_{timestamp}.xlsx'
        result.to_excel(backup_path, index=False, engine='openpyxl')
        log.info(f"Файл {output_path} был занят. Результаты сохранены в файл: {backup_path}")
    except Exception as e:
        log.error(f"Ошибка при сохранении файла: {e}")
        sys.exit(1)

    sys.exit(0)
