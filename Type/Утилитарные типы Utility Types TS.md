#TypeScript  #Types  #TS 

Этот иструмент позволяет создавать новые типы основываясь на других типах.  Пример:
```ts
type DiaryEntry = {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
};
```
Нам нужно создать тип в котором не будет comment. Вместо того что-бы переписывать всё в ручную и копировать один и тот же код мы воспользуемся утилитарными типами 
```ts
type NonSensitiveDiaryEntry = Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>;
```
**Что делает `Pick`?**  
Он "выбирает" только указанные поля из существующего типа.

`Omit` — исключает ненужные поля из существующего типа.
```ts
type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

**`Partial`** — делает все поля типа необязательными.
**`Required`** — делает все поля обязательными.
**`Readonly`** — делает все поля только для чтения.
**`Record`** — создаёт объект с ключами определённого типа.

Всегда нужно быть осторожным при использовании утилитарных типов и помнить, что они работают только с типами, а не с данными. Пример 
```ts
import { Omit } from 'typescript';

type DiaryEntry = {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
};

// Создаем новый тип без поля comment
type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

// Функция возвращает тип NonSensitiveDiaryEntry, но данные остаются неизменёнными
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return [
    {
      id: 1,
      date: "2022-01-01",
      weather: "sunny",
      visibility: "great",
      comment: "Confidential data!"
    }
  ];
};

const entries = getNonSensitiveEntries();
console.log(entries);
```
Утилитарные типы могут дать ложное чувство безопасности, как в этом примере. Хоть мы и исключили тип comment, данные не изменились и в логе выведутся данные вместе с comment. Поэтому <font color="#c00000">всегда!</font> нужно фильтровать данные в ручную. 
```ts
import diaries from '../../data/entries.ts'
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types'
const getEntries = () : DiaryEntry[] => {
  return diaries
}

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

const addDiary = () => {
  return null;
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addDiary
}
```
Таким образом мы использовали utility tipes что сэкономило нам время и нам не пришлось писать новый тип с нуля. Но так-же мы убедились, что comment были исключены не только из типа, но и из данных.