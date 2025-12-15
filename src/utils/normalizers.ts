/**
 * Payload normalizers for frontend compatibility
 * Centralized logic to transform FE payload variants to BE format
 */

/**
 * Normalize registration payload
 * Accepts: {name} OR {fullName}
 * Returns: {fullName}
 */
export function normalizeRegisterPayload(body: any) {
  return {
    ...body,
    fullName: body.fullName || body.name,
  };
}

/**
 * Normalize question creation payload
 * Accepts: {question} OR {title, content}
 * Returns: {title, content, doctorId?}
 */
export function normalizeQuestionPayload(body: any) {
  if (body.question) {
    const questionText = body.question;
    return {
      title: questionText.substring(0, 80) || 'Question',
      content: questionText,
      doctorId: body.doctorId,
    };
  }
  return body;
}

/**
 * Normalize appointment creation payload
 * Accepts: {date, time} OR {scheduledAt}
 * Returns: {doctorId, scheduledAt, reason, notes?}
 */
export function normalizeAppointmentPayload(body: any) {
  if (body.date && body.time) {
    const scheduledAt = new Date(`${body.date}T${body.time}:00.000Z`);
    return {
      doctorId: body.doctorId,
      scheduledAt,
      reason: body.reason || body.notes || 'Consultation',
      notes: body.notes,
    };
  }
  return {
    ...body,
    scheduledAt: new Date(body.scheduledAt),
    reason: body.reason || 'Consultation',
  };
}

/**
 * Normalize rating creation payload
 * Accepts: {consultationId, rating} OR {appointmentId, score}
 * Returns: {appointmentId, doctorId, score, comment?}
 */
export function normalizeRatingPayload(body: any) {
  return {
    appointmentId: body.appointmentId || body.consultationId,
    doctorId: body.doctorId,
    score: body.score || body.rating,
    comment: body.comment,
  };
}

/**
 * Normalize answer creation payload
 * Accepts: {answer} OR {content}
 * Returns: {content}
 */
export function normalizeAnswerPayload(body: any) {
  return {
    content: body.content || body.answer,
  };
}

/**
 * Sanitize text input (trim and enforce max length)
 */
export function sanitizeText(text: string | undefined | null, maxLength?: number): string | undefined {
  if (!text) return undefined;
  
  let sanitized = text.trim();
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize object with text fields
 */
export function sanitizeTextFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  maxLengths?: Partial<Record<keyof T, number>>
): T {
  const sanitized = { ...obj };
  
  for (const field of fields) {
    if (typeof sanitized[field] === 'string') {
      const maxLength = maxLengths?.[field];
      sanitized[field] = sanitizeText(sanitized[field], maxLength) as any;
    }
  }
  
  return sanitized;
}
