export const getMediaTypeAR7 = (filePath: string): string => {
  // Get the file extension
  const fileExtension = filePath.split('.').pop()?.toLowerCase();

  // Common image file extensions
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
    'tiff',
    'heif',
    'ico',
    'raw',
    'exif',
  ];

  // Common video file extensions
  const videoExtensions = [
    'mp4',
    'avi',
    'mkv',
    'mov',
    'flv',
    'wmv',
    'webm',
    'mpeg',
    'mpg',
    '3gp',
    'ogv',
    'qt',
    'rm',
    'swf',
  ];

  // Common audio file extensions
  const audioExtensions = [
    'mp3',
    'wav',
    'ogg',
    'flac',
    'aac',
    'm4a',
    'wma',
    'alac',
    'pcm',
    'aiff',
    'ape',
    'opus',
  ];

  // Return the media type based on the extension
  if (imageExtensions.includes(fileExtension || '')) {
    return 'image';
  } else if (videoExtensions.includes(fileExtension || '')) {
    return 'video';
  } else if (audioExtensions.includes(fileExtension || '')) {
    return 'audio';
  } else {
    return 'unknown'; // Return unknown if the file type isn't recognized
  }
};
