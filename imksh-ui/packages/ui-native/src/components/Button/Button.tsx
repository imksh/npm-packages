import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "../../utils";

export interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
}

export function Button({
  children,
  variant = "default",
  size = "md",
  className,
  textClassName,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-md";
  const sizeStyles = {
    sm: "h-9 px-3",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 rounded-md",
  };
  
  const variantStyles = {
    default: "bg-black dark:bg-white",
    destructive: "bg-red-500",
    outline: "border border-gray-200 dark:border-gray-800 bg-transparent",
    secondary: "bg-gray-100 dark:bg-gray-800",
    ghost: "bg-transparent",
  };
  
  const textBaseStyles = "font-medium text-center";
  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  const textVariantStyles = {
    default: "text-white dark:text-black",
    destructive: "text-white",
    outline: "text-black dark:text-white",
    secondary: "text-black dark:text-white",
    ghost: "text-black dark:text-white",
  };

  return (
    // @ts-ignore: React 19 type conflict with React Native
    <Pressable
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* @ts-ignore */}
      <Text
        className={cn(
          textBaseStyles,
          textSizeStyles[size],
          textVariantStyles[variant],
          textClassName
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
