import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AiInsight, InsightType } from '../../src/ai-insights/entities/ai-insight.entity';
import { User } from '../../src/users/entities/user.entity';

export class AiInsightSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const aiInsightRepository = dataSource.getRepository(AiInsight);
    const userRepository = dataSource.getRepository(User);
    
    
    const users = await userRepository.find();
    
    
    const insightData = {
      [InsightType.TIME_ACCURACY]: [
        'You consistently underestimate tasks by 20%. Consider adding a buffer to your estimates.',
        'Your time accuracy has improved by 15% over the last month.',
        'You tend to overestimate frontend tasks but underestimate backend tasks.',
        'Morning tasks are completed 30% faster than afternoon tasks.',
      ],
      [InsightType.PRODUCTIVITY_PATTERN]: [
        'Your productivity peaks between 10am-12pm. Schedule complex tasks during this window.',
        'Taking breaks every 90 minutes improves your completion rate by 25%.',
        'You complete 40% more tasks when you group similar work together.',
        'Working sessions longer than 3 hours show a 30% decrease in productivity.',
      ],
      [InsightType.TASK_BREAKDOWN]: [
        'Breaking tasks into smaller chunks has improved your completion rate by 35%.',
        'Tasks with clear descriptions are completed 45% faster than vague ones.',
        'You spend 30% of your time on non-coding tasks. Consider delegating or automating these.',
        'Your most time-consuming task type is debugging, accounting for 40% of your work hours.',
      ],
      [InsightType.TECH_PERFORMANCE]: [
        'You complete React tasks 25% faster than Angular tasks.',
        'Database-related tasks take 40% longer than your estimates.',
        'Your TypeScript productivity has improved by 30% in the last 3 months.',
        'You`re most efficient with Node.js compared to other backend technologies.',
      ],
    };
    
    
    for (const user of users) {
      
      for (const [type, insights] of Object.entries(insightData)) {
        const insightsToAdd = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < insightsToAdd; i++) {
          
          const randomIndex = Math.floor(Math.random() * insights.length);
          const description = insights[randomIndex];
          
          const existingInsight = await aiInsightRepository.findOneBy({
            user_id: user.id,
            type: type as InsightType,
            description,
          });
          
          if (!existingInsight) {
            await aiInsightRepository.insert({
              user_id: user.id,
              type: type as InsightType,
              description,
            });
          }
        }
      }
    }
  }
}