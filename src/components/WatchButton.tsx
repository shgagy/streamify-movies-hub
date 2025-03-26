
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WatchButtonProps {
  id: string;
  type?: 'movie' | 'tvshow';
  variant?: 'primary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WatchButton: React.FC<WatchButtonProps> = ({
  id,
  type = 'movie',
  variant = 'primary',
  size = 'md',
  className,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${type}/${id}`);
  };

  // Style based on variant
  const getButtonStyles = () => {
    const baseStyles = "flex items-center transition-all";
    const sizeClasses = {
      sm: "text-xs gap-1",
      md: "text-sm gap-2",
      lg: "text-base gap-2",
    };
    
    switch (variant) {
      case 'primary':
        return cn(
          baseStyles,
          "bg-primary hover:bg-primary/90 text-white rounded-md",
          {
            'px-2 py-1': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3': size === 'lg',
          },
          sizeClasses[size]
        );
      case 'ghost':
        return cn(
          baseStyles,
          "bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-md",
          {
            'px-2 py-1': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3': size === 'lg',
          },
          sizeClasses[size]
        );
      case 'icon':
        return cn(
          "flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90",
          {
            'w-8 h-8': size === 'sm',
            'w-10 h-10': size === 'md',
            'w-12 h-12': size === 'lg',
          }
        );
    }
  };

  // Play icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'md': return 18;
      case 'lg': return 22;
      default: return 18;
    }
  };

  return (
    <Button 
      className={cn(getButtonStyles(), className)} 
      onClick={handleClick}
    >
      <Play size={getIconSize()} className={variant === 'icon' ? 'ml-0.5' : ''} />
      {variant !== 'icon' && <span>Watch</span>}
    </Button>
  );
};

export default WatchButton;
