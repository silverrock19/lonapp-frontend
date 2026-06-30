/**
 * Segmented progress bar stepper.
 *
 * Props:
 *   steps        – short labels shown under the bar  e.g. ['Company', 'Outlets', …]
 *   fullLabels   – long labels used in the caption   e.g. ['Company information', 'Outlets & factories', …]
 *   currentStep  – 0-based index of the active step
 */
const Stepper = ({ steps, fullLabels, currentStep }) => {
  const caption = (fullLabels ?? steps)[currentStep];

  return (
    <div>

      {/* Caption: "Step 2 of 5 · Outlets & factories" */}
      <div className="mb-2.5 flex items-baseline gap-1.5">
        <span className="text-[12px] font-medium text-neutral-400">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-[12px] text-neutral-300" aria-hidden="true">·</span>
        <span className="text-[12px] font-semibold text-neutral-900">{caption}</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-colors duration-500 ${
                done   ? 'bg-success' :
                active ? 'bg-primary-500' :
                         'bg-neutral-200'
              }`}
              style={{ height: 7 }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Step labels aligned to segments */}
      <div className="mt-2 flex">
        {steps.map((label, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={label} className="flex-1 text-center">
              <span
                className={`text-[10.5px] leading-none tracking-wide uppercase transition-colors duration-200 ${
                  active ? 'font-bold text-neutral-900' :
                  done   ? 'font-semibold text-neutral-600' :
                           'font-medium text-neutral-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Stepper;
