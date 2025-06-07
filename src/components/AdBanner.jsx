import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AdBanner = ({ children, adData, defaultAltText, className, imageClassName }) => {
  const imageUrl = adData?.imageUrl;
  const linkUrl = adData?.linkUrl;
  const altText = adData?.altText || defaultAltText || "Espacio Publicitario";

  const adContent = (
    <motion.div
      className={cn("bg-muted/30 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center text-center text-sm text-muted-foreground overflow-hidden", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={altText} className={cn("max-h-full max-w-full object-cover", imageClassName)} />
      ) : (
        children || <span className="italic">{altText}</span>
      )}
    </motion.div>
  );

  if (linkUrl && linkUrl !== "#" && linkUrl.trim() !== "") {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block no-underline">
        {adContent}
      </a>
    );
  }

  return adContent;
};

export default AdBanner;