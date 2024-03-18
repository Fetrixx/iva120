import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appThousandsSeparator]'
})
export class ThousandsSeparatorDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any) {
    // Obtener el valor actual del input
    let value = event.target.value;

    // Eliminar todos los puntos y comas del valor
    value = value.replace(/[.,]/g, '');

    // Formatear el valor con puntos como separadores de miles
    value = this.formatWithThousandsSeparator(value);

    // Asignar el valor formateado de nuevo al input
    this.el.nativeElement.value = value;
  }

  private formatWithThousandsSeparator(value: string): string {
    // Convertir el valor a un número y formatearlo con puntos como separadores de miles
    return parseInt(value).toLocaleString('es-ES');
  }
}
