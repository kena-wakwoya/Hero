import userRepository from '../../database/repositories/user.repository';

export default async function ({ call_date, alert_date, hero_date, trending_date }) {
    const [call_count, alert_count, hero_count, [trending_alert]] = await userRepository.generateDashboardStats({
        call_date,
        alert_date,
        hero_date,
        trending_date,
    });
    return {
        call_count,
        alert_count,
        hero_count,
        trending_alert,
    };
}
