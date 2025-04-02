#React #JS #state #documentation

По сути говоря всё достаточно просто. Мы используем обычный useState чтобы создать состояние. Затем помещаем это состояние внутрь provider, что делает это состояние доступным во всех компонентах обёрнутых в этот provider. А useContext даёт нам доступ к этому состоянию из других компонентов. Ниже пример как я создавал глобальное состояние для пользователя.

```JS
const UserContext = createContext(); //Создание контекста

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Создание состояния

  return (
    <UserContext.Provider value={{ user, setUser }}> // Передача состояния
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

```

Загвоздка состоит в Fast Refresh в React.  Чтобы он работал нельзя экспортировать из .tsx(.jsx) файлов, что либо кроме React компонентов. А значит в предыдущем коде мы получим предупреждение 
`Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.eslint(react-refresh/only-export-components)`

Решение простое. Разделить предыдущий код на два файла. Один будет создавать provider в .tsx(jsx) файле. А другой будет создавать context в .ts(js). Ниже пример из моего приложения для создания меню. В примере я создаю контекст который хранит значения, какой компонент на данный момент сортируется. Я использовал это, чтобы реализовать логику, при нажатии на кнопку сортировать в одном компоненте. Сортировка (если была активна) отключается в других компонентах.
```ts
// SortingContext.ts
import { createContext, useContext } from "react";  

type SortingContextType = {
  activeSorting: string | null;
  setActiveSorting: (id: string | null) => void;
};

export const SortingContext = createContext<SortingContextType>({
  activeSorting: null,
  setActiveSorting: () => {},
});
// если попытаться использовать контекст вне его провайдера, 
// то получим соответсвущую ошибку 
export const useSorting = () => {
  const context = useContext(SortingContext);
  if (!context) {
    throw new Error("useSorting must be used within SortingProvider");
  }
  return context;
};
```

```tsx
// SortingProvider.tsx
import { useState, ReactNode } from "react";
import { SortingContext } from "./SortingContext";

type SortingProviderProps = {
  children: ReactNode;
};

export const SortingProvider = ({ children }: SortingProviderProps) => {
  const [activeSorting, setActiveSorting] = useState<string | null>(null);

  return (
    <SortingContext.Provider value={{ activeSorting, setActiveSorting }}>
      {children}
    </SortingContext.Provider>
  );
};
```

Обязательно обернуть. В provider ту часть приложения где будет использован context. 