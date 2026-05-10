/**
 * File Upload & Drag-Drop Service
 * Handles file operations for data import/export and file uploads
 */

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onProgress?: (progress: number) => void;
}

export interface FileExportOptions {
  format: 'csv' | 'json';
  filename?: string;
}

class FileService {
  /**
   * Setup drag and drop listeners on an element
   */
  static setupDragDrop(
    element: HTMLElement,
    onDrop: (files: File[]) => void,
    acceptedTypes: string[] = []
  ): void {
    const dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (element) {
        element.classList.add('drag-over');
      }
    };

    const dragLeaveHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (element) {
        element.classList.remove('drag-over');
      }
    };

    const dropHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (element) {
        element.classList.remove('drag-over');
      }

      if (e.dataTransfer?.files) {
        const files = Array.from(e.dataTransfer.files);

        // Filter by accepted types if specified
        const filteredFiles =
          acceptedTypes.length > 0
            ? files.filter((file) =>
                acceptedTypes.some((type) =>
                  type === '*/*' || file.type === type || file.name.endsWith(type.replace('*.', ''))
                )
              )
            : files;

        if (filteredFiles.length > 0) {
          onDrop(filteredFiles);
        }
      }
    };

    element.addEventListener('dragover', dragOverHandler);
    element.addEventListener('dragleave', dragLeaveHandler);
    element.addEventListener('drop', dropHandler);

    // Return cleanup function
    return () => {
      element.removeEventListener('dragover', dragOverHandler);
      element.removeEventListener('dragleave', dragLeaveHandler);
      element.removeEventListener('drop', dropHandler);
    };
  }

  /**
   * Parse CSV file
   */
  static async parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map((h) => h.trim());

          const data = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
              const values = line.split(',').map((v) => v.trim());
              const obj: any = {};

              headers.forEach((header, index) => {
                obj[header] = values[index];
              });

              return obj;
            });

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse JSON file
   */
  static async parseJSON(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          resolve(json);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Export data as CSV
   */
  static exportAsCSV(
    data: any[],
    filename: string = 'export.csv'
  ): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      ),
    ].join('\n');

    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * Export data as JSON
   */
  static exportAsJSON(data: any, filename: string = 'export.json'): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  /**
   * Download file to user's device
   */
  static downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate timestamp for export filename
   */
  static generateFilename(prefix: string = 'export', format: 'csv' | 'json' = 'json'): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${prefix}_${timestamp}.${format}`;
  }

  /**
   * Validate file
   */
  static validateFile(
    file: File,
    options: FileUploadOptions
  ): { valid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, acceptedTypes = [] } = options;

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File terlalu besar. Max: ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Format file tidak didukung. Accepted: ${acceptedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }
}

export default FileService;
