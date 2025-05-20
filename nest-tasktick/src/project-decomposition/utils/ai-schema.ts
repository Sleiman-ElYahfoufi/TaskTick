import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { ParsedTask } from './types';


export function createTaskSchema() {
    return z.array(z.object({
        name: z.string().min(1),
        description: z.string().optional().default(''),
        estimated_time: z.number().positive().or(z.string().transform(val => parseFloat(val) || 1)),
        priority: z.enum(['low', 'medium', 'high']).default('medium'),
        dueDate: z.string(),
        progress: z.number().min(0).max(100).optional().default(0)
    }));
}


export function createTaskOutputParser() {
    const taskSchema = createTaskSchema();
    return StructuredOutputParser.fromZodSchema(taskSchema);
} 