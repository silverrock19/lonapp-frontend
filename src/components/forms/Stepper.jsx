import { Check } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const Stepper = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-small font-semibold transition-all duration-200',
                  done   && 'bg-primary-500 text-white',
                  active && 'border-2 border-primary-500 bg-white text-primary-500',
                  !done && !active && 'border-2 border-neutral-300 bg-white text-neutral-400'
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </div>
              <span className={cn('mt-1 text-caption', active ? 'text-primary-600 font-semibold' : 'text-neutral-500')}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('mb-5 h-0.5 w-12 flex-shrink-0 mx-2 transition-colors duration-300', done ? 'bg-primary-500' : 'bg-neutral-200')} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Stepper;
