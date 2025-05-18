import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Logger } from '@nestjs/common';

// Initialize logger
const logger = new Logger('PromptInjectionValidator');

// Suspicious patterns that might indicate a prompt injection attempt
const SUSPICIOUS_PATTERNS = [
  /ignore previous instructions/i,
  /disregard (all|previous) instructions/i,
  /ignore everything (above|before)/i,
  /forget your previous instructions/i,
  /you are now/i,
  /pretend to be/i,
  /act as if/i,
  /you will simulate/i,
  /system prompt:/i,
  /@(system|user|assistant)/i,
  /\[\{\{\{.*\}\}\}\]/i, // JSONL message format pattern
  /<\|.*\|>/i,           // Control tokens pattern
];

export function IsPromptSafe(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPromptSafe',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Potential prompt injection detected in input',
        ...validationOptions
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          try {
            // If not a string, we don't need to validate
            if (typeof value !== 'string') {
              return true;
            }
            
            // Skip validation for empty strings
            if (!value || value.trim() === '') {
              return true;
            }
            
            // Check for suspicious patterns
            for (const pattern of SUSPICIOUS_PATTERNS) {
              if (pattern.test(value)) {
                logger.warn(`Prompt injection detected: ${pattern.toString()} in "${value.substring(0, 50)}..."`);
                return false;
              }
            }
            
            // Check for extremely long inputs
            if (value.length > 5000) {
              logger.warn(`Input exceeds length limit: ${value.length} chars`);
              return false;
            }
            
            return true;
          } catch (error) {
            // Log error but don't block the request - fail open instead of fail closed
            logger.error(`Error in prompt validation: ${error.message}`, error.stack);
            return true; // Allow it to pass if validation fails
          }
        }
      }
    });
  };
} 