# Serie de Fibonacci hasta un Límite
limite = int(input("Ingrese el valor límite para la serie Fibonacci: "))
a, b = 0, 1
while a <= limite:
    if a % 2 == 0:
        print(f"{a} (par)")
    else:
        print(a)
    a, b = b, a + b
# Fin 