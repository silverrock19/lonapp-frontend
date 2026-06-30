import { cn } from '../../utils/classNames.js';
import CheckIcon from '../icons/CheckIcon.jsx';

const Checkbox = ({ checked, onChange }) => (
  <button onClick={onChange} className="flex items-center justify-center text-neutral-400 hover:text-neutral-700">
    <div className={cn('flex h-4 w-4 items-center justify-center border', checked ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white')} style={{ borderRadius: 2 }}>
      {checked && <CheckIcon />}
    </div>
  </button>
);

export default Checkbox;
