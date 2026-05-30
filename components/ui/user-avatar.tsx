'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatName } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: {
    name: string;
    image?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export function UserAvatar({ user, className, size = 'md' }: UserAvatarProps) {
  const { firstName, lastName } = formatName(user.name);
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback>{initials || '?'}</AvatarFallback>
    </Avatar>
  );
}
