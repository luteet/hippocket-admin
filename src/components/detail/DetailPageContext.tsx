import { createContext, useContext, type ReactNode } from 'react'

import type { DetailAction } from './DetailPage'

export interface DetailPageContextValue {
	/** Навигация назад (обязательно) */
	onBack: () => void
	/** Переход на редактирование */
	onEdit?: () => void

	/** Удаление */
	onDelete?: () => void
	isDeleting?: boolean

	/** Статус загрузки */
	isLoading?: boolean
	/** Данные загружены и готовы к отображению */
	ready?: boolean

	/** Табы */
	activeTab?: string
	onTabChange?: (tab: string) => void

	/** Дополнительные кнопки в хедере */
	actions?: DetailAction[]
}

const DetailPageContext = createContext<DetailPageContextValue | null>(null)

export function DetailPageProvider({
	value,
	children,
}: {
	value: DetailPageContextValue
	children: ReactNode
}) {
	return (
		<DetailPageContext.Provider value={value}>
			{children}
		</DetailPageContext.Provider>
	)
}

export function useDetailPageContext(): DetailPageContextValue | null {
	return useContext(DetailPageContext)
}
