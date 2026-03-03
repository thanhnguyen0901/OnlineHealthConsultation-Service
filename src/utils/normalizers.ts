/**
 * Payload normalizers for frontend compatibility
 * Centralized logic to transform FE payload variants to BE format
 */

/**
 * Normalize registration payload.
 * Accepts firstName/lastName directly, or a combined fullName/name string.
 * Splits combined names on the first space and returns { ...body, firstName, lastName }
 * without the legacy fullName/name fields.
 */
export function normalizeRegisterPayload(body: any) {
  // If individual name parts are already provided, strip any legacy combined field.
  if (body.firstName || body.lastName) {
    const { fullName, name, ...rest } = body;
    return rest;
  }
  // Split a combined name string into firstName and lastName.
  const raw = ((body.fullName || body.name) as string | undefined)?.trim() ?? '';
  const spaceIdx = raw.indexOf(' ');
  const firstName = spaceIdx >= 0 ? raw.slice(0, spaceIdx) : raw;
  const lastName = spaceIdx >= 0 ? raw.slice(spaceIdx + 1).trim() : '';
  const { fullName, name, ...rest } = body;
  return { ...rest, firstName, lastName };
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
      /** Passed through for informational purposes; not persisted on Question (no DB column). */
      specialtyId: body.specialtyId,
    };
  }
  return body;
}

/**
 * Normalize appointment creation payload
 * Accepts: {scheduledAt} (preferred, UTC ISO string)
 *       OR {date, time} (legacy — treated as LOCAL time by omitting 'Z',
 *          relies on the server running in UTC; kept for backward compatibility).
 * Returns: {doctorId, scheduledAt: Date, reason, notes?}
 *
 * NOTE: `reason` is required at the Zod validation layer (createAppointmentSchema)
 * so it is always present by the time this normalizer runs.
 * No silent fallback is applied — callers MUST supply a non-empty reason.
 */
export function normalizeAppointmentPayload(body: any) {
  if (body.scheduledAt) {
    // Preferred path: FE sends a full UTC ISO string (e.g. "2026-03-15T01:00:00.000Z").
    // new Date() parses ISO-8601 strings correctly regardless of server timezone.
    return {
      doctorId: body.doctorId,
      scheduledAt: new Date(body.scheduledAt),
      reason: body.reason as string,
      notes: body.notes,
      durationMinutes: body.durationMinutes,
    };
  }
  // Legacy path: separate date + time strings (no timezone info).
  // Omit 'Z' so Node.js interprets the string in the **server** local timezone.
  // On a UTC server this is equivalent to UTC; in any other timezone the result
  // is still deterministic as long as the server TZ is documented.
  const scheduledAt = new Date(`${body.date}T${body.time}:00`);
  return {
    doctorId: body.doctorId,
    scheduledAt,
    reason: body.reason as string,
    notes: body.notes,
    durationMinutes: body.durationMinutes,
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
