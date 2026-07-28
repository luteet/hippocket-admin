import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'

interface UseDetailPageOptions {
	/** Путь к списку этой сущности, напр. '/partner-connect' */
	basePath: string
	/** Ключи вкладок, если страница табированная */
	tabKeys?: readonly string[]
}

/**
 * Базовый хук для страницы деталей.
 * Возвращает id из URL, onBack/onEdit навигацию и состояние вкладок.
 */
export function useDetailPage(options: UseDetailPageOptions) {
	const { id } = useParams()
	const navigate = useNavigate()
	const [tab, setTab] = useState(options.tabKeys?.[0] ?? '')

	return {
		id,
		onBack: () => navigate(options.basePath),
		onEdit: id ? () => navigate(`${options.basePath}/${id}/edit`) : undefined,
		activeTab: tab,
		onTabChange: (key: string) => setTab(key),
	}
}

interface UseDetailPageDeleteOptions {
	basePath: string
	successMessage?: string
	errorMessage?: string
}

/**
 * Общий хелпер для создания handleDelete.
 *
 * @param id — id записи из useParams
 * @param deleteFn — вызов мутации удаления (mutateAsync)
 * @param isPending — флаг isPending мутации
 * @param options — basePath (куда редиректить после успеха), сообщения
 */
export function useDetailPageDelete(
	id: string | undefined,
	deleteFn: (id: string) => Promise<unknown>,
	isPending: boolean,
	options: UseDetailPageDeleteOptions,
) {
	const navigate = useNavigate()

	const handleDelete = async () => {
		if (!id) return
		try {
			await deleteFn(id)
			toast.success(options.successMessage ?? 'Deleted')
			navigate(options.basePath)
		} catch (error) {
			toast.error(
				getApiErrorMessage(
					error,
					options.errorMessage ?? 'Failed to delete',
				),
			)
		}
	}

	return {
		onDelete: handleDelete,
		isDeleting: isPending,
	}
}
