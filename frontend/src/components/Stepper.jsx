import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

/**
 * Beautiful Stepper Component
 * Step indicator for multi-step processes
 */
const Stepper = ({
  steps,
  currentStep,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold transition-all duration-300
                  ${isCompleted
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {isCompleted ? (
                  <FaCheck className="text-sm" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={`
                    text-sm font-semibold
                    ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2">
                <div className="h-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      isCompleted
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                        : 'bg-gray-200'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
