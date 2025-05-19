import { format, isToday, parseISO } from 'date-fns';

export function formatToWon(price: number): string {
  return price.toLocaleString('ko');
}

export function formatToTimeAgo(date: string): string {
  const dayInMs = 24 * 60 * 60 * 1000;
  const time = new Date(date).getTime();
  const now = new Date().getTime();

  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat('ko');

  return formatter.format(diff, 'days');
}

export function formatToTime(date: string): string {
  const time = new Date(date);

  const formatter = new Intl.DateTimeFormat('ko', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Ensures that the time is displayed in 12-hour format with AM/PM
  });

  return formatter.format(time);
}

export function formatToDayAndTime(date: string): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'; // 유효하지 않은 날짜일 경우 반환
  }

  // 날짜 부분 포맷팅
  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    month: 'long', // 'September'
    day: '2-digit', // '02'
  });

  // 시간 부분 포맷팅
  const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12시간 형식
  });

  // 날짜와 시간 포맷팅
  const formattedDate = dateFormatter.format(dateObj);
  const formattedTime = timeFormatter.format(dateObj);

  return `${formattedDate} ${formattedTime}`;
}

export function formatDate(date: string): string {
  const parsedDate = parseISO(date);
  return isToday(parsedDate) ? formatToTime(date) : formatToDayAndTime(date);
}

export enum ProductStatus {
  SALE = '판매중',
  RESERVED = '예약중',
  SOLD_OUT = '판매완료',
}
