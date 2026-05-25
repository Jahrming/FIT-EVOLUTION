import {
  IsString, IsEmail, IsEnum, IsBoolean, IsOptional,
  MinLength, MaxLength, Matches, IsNotEmpty, IsDateString, ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

enum TipoDocumento { CC = 'CC', CE = 'CE', PA = 'PA', TI = 'TI' }

class FormularioDto {
  @IsString() @MinLength(5) @MaxLength(100) nombreCompleto: string
  @IsEnum(TipoDocumento) tipoDocumento: TipoDocumento
  @IsString() @Matches(/^\d{5,12}$/) numeroDocumento: string
  @IsDateString() fechaNacimiento: string
  @IsString() @Matches(/^\d{10}$/) telefono: string
  @IsEmail() correoElectronico: string
  @IsEmail() correoConfirmar: string
  @IsOptional() @IsString() contactoEmergenciaNombre?: string
  @IsOptional() @IsString() @Matches(/^\d{10}$/) contactoEmergenciaTelefono?: string
}

export class CreateAceptacionDto {
  @IsString() @IsNotEmpty() sedeId: string
  @IsString() @IsNotEmpty() terminosVersionId: string
  @ValidateNested()
  @Type(() => FormularioDto)
  @IsNotEmpty()
  formulario: FormularioDto
  @IsString() @IsOptional() firmaBase64?: string
  @IsString() @IsNotEmpty() sessionToken: string
  @IsBoolean() aceptaTerminos: boolean
  @IsBoolean() aceptaTratamientoDatos: boolean
  @IsBoolean() declaraCondicionFisica: boolean
  @IsBoolean() autorizaUsoImagen: boolean
  @IsOptional() @IsString() @MaxLength(500) condicionMedicaEspecial?: string
}
