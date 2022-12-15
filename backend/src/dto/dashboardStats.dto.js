import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
export function generateDashboardStats(req, res, next) {
    try {
        let { call_date, alert_date, hero_date, trending_date } = req.body;
        if (!call_date || !alert_date || !hero_date || !trending_date) {
            return next(
                new ApplicationResponseException(
                    'VALIDATION_ERROR',
                    'body.call_date,body.alert_date,body.hero_date and body.trending_date are required',
                    400,
                ),
            );
        }
        req.validatedInput = {
            ...(req?.validatedInput ?? {}),
            body: {
                call_date: call_date,
                alert_date: alert_date,
                hero_date: hero_date,
                trending_date: trending_date,
            },
        };
        return next();
    } catch (error) {
        next(error);
    }
}
