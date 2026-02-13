import type { ExpenseCategory } from '../../../types/expenses'

export default defineEventHandler(async (event): Promise<ExpenseCategory[]> => {
    const config = useRuntimeConfig()

    // Get access token
    const accessToken = getCookie(event, 'accessToken')
    if (!accessToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Missing or invalid token',
        })
    }

    try {
        const response = await $fetch<ExpenseCategory[]>(`${config.public.apiBaseUrl}/api/expenses/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })

        setResponseStatus(event, 200)
        return response
    }
    catch (error: any) {
        if (error.statusCode) {
            setResponseStatus(event, error.statusCode)
            throw createError({
                statusCode: error.statusCode,
                statusMessage: error.statusMessage,
                message: error.data?.message ?? 'Unable to get expense categories',
                data: error.data,
            })
        }

        setResponseStatus(event, 500)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
            message: 'Unable to get expense categories',
        })
    }
})
