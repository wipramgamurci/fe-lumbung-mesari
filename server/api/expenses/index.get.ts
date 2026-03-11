import type { ExpensesResponse } from '../../../types/expenses'

export default defineEventHandler(async (event): Promise<ExpensesResponse> => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    // Extract query parameters
    const pageStr = Array.isArray(query.page) ? query.page[0] : query.page
    const limitStr = Array.isArray(query.limit) ? query.limit[0] : query.limit
    // Search removed as per API update
    const sortBy = Array.isArray(query.sortBy) ? query.sortBy[0] : query.sortBy
    const sortOrder = Array.isArray(query.sortOrder) ? query.sortOrder[0] : query.sortOrder
    const category = Array.isArray(query.category) ? query.category[0] : query.category
    const startDate = Array.isArray(query.startDate) ? query.startDate[0] : query.startDate
    const endDate = Array.isArray(query.endDate) ? query.endDate[0] : query.endDate
    const minAmount = Array.isArray(query.minAmount) ? query.minAmount[0] : query.minAmount
    const maxAmount = Array.isArray(query.maxAmount) ? query.maxAmount[0] : query.maxAmount

    // Parse and set defaults
    const page = pageStr ? parseInt(pageStr as string, 10) || 1 : 1
    const limit = limitStr ? parseInt(limitStr as string, 10) || 10 : 10
    const sortByParam = (sortBy as string) || 'created_at'
    const sortOrderParam = (sortOrder as string) || 'desc'

    // Validate sortBy if provided
    const validSortBy = ['created_at', 'updated_at', 'amount', 'category']
    if (sortBy && !validSortBy.includes(sortBy as string)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: `Invalid sortBy. Must be one of: ${validSortBy.join(', ')}`,
        })
    }

    // Validate sortOrder if provided
    const validSortOrder = ['asc', 'desc']
    if (sortOrder && !validSortOrder.includes(sortOrder as string)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: `Invalid sortOrder. Must be one of: ${validSortOrder.join(', ')}`,
        })
    }

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
        // Build query string
        const queryParams: string[] = [`page=${page}`, `limit=${limit}`]

        if (sortByParam)
            queryParams.push(`sortBy=${encodeURIComponent(sortByParam)}`)
        if (sortOrderParam)
            queryParams.push(`sortOrder=${encodeURIComponent(sortOrderParam)}`)
        if (category)
            queryParams.push(`category=${encodeURIComponent(category as string)}`)
        if (startDate)
            queryParams.push(`startDate=${encodeURIComponent(startDate as string)}`)
        if (endDate)
            queryParams.push(`endDate=${encodeURIComponent(endDate as string)}`)
        if (minAmount)
            queryParams.push(`minAmount=${encodeURIComponent(minAmount as string)}`)
        if (maxAmount)
            queryParams.push(`maxAmount=${encodeURIComponent(maxAmount as string)}`)

        const queryString = `?${queryParams.join('&')}`

        const response = await $fetch<ExpensesResponse>(`${config.public.apiBaseUrl}/api/expenses${queryString}`, {
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
                message: error.data?.message ?? 'Unable to get expenses',
                data: error.data,
            })
        }

        setResponseStatus(event, 500)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
            message: 'Unable to get expenses',
        })
    }
})
