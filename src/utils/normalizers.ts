export function normalizeRegisterPayload(body: any) {
  if (body.firstName || body.lastName) {
    const { fullName, name, ...rest } = body;
    return rest;
  }
  const raw = ((body.fullName || body.name) as string | undefined)?.trim() ?? '';
  const spaceIdx = raw.indexOf(' ');
  const firstName = spaceIdx >= 0 ? raw.slice(0, spaceIdx) : raw;
  const lastName = spaceIdx >= 0 ? raw.slice(spaceIdx + 1).trim() : '';
  const { fullName, name, ...rest } = body;
  return { ...rest, firstName, lastName };
}

export function normalizeQuestionPayload(body: any) {
  if (body.question) {
    const questionText = body.question;
    return {
      title: questionText.substring(0, 80) || 'Question',
      content: questionText,
      doctorId: body.doctorId,
      // specialtyId is not persisted on Question; used only for doctor auto-assignment routing.
      specialtyId: body.specialtyId,
    };
  }
  return body;
}

export function normalizeAppointmentPayload(body: any) {
  if (body.scheduledAt) {
    return {
      doctorId: body.doctorId,
      scheduledAt: new Date(body.scheduledAt),
      reason: body.reason as string,
      notes: body.notes,
      durationMinutes: body.durationMinutes,
    };
  }
  // Omit 'Z': Node.js parses as server local-time; on a UTC server this is equivalent to UTC.
  const scheduledAt = new Date(`${body.date}T${body.time}:00`);
  return {
    doctorId: body.doctorId,
    scheduledAt,
    reason: body.reason as string,
    notes: body.notes,
    durationMinutes: body.durationMinutes,
  };
}

export function normalizeRatingPayload(body: any) {
  return {
    appointmentId: body.appointmentId || body.consultationId,
    doctorId: body.doctorId,
    score: body.score || body.rating,
    comment: body.comment,
  };
}

export function normalizeAnswerPayload(body: any) {
  return {
    content: body.content || body.answer,
  };
}

export function sanitizeText(text: string | undefined | null, maxLength?: number): string | undefined {
  if (!text) return undefined;
  
  let sanitized = text.trim();
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

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
