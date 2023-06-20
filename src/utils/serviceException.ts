export class ServiceError extends Error {
	public code: number;

	constructor(message: string, code: number) {
		super(message);
		this.message = message;
		this.code = code;
	}
}

export class BadRequestException extends ServiceError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class UnauthorizedException extends ServiceError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class NotFoundException extends ServiceError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class InternalServerErrorException extends ServiceError {
	constructor(message: string) {
		super(message, 500);
	}
}
